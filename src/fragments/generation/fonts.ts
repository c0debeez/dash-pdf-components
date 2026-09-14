import { Font } from "@react-pdf/renderer";
import { callbackContext } from "./document";
import { resolveFunction } from "./functions";
const variants = new Map<string, string>();
const weights: Record<string, number> = {
  thin: 100,
  hairline: 100,
  ultralight: 200,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  ultrabold: 800,
  extrabold: 800,
  heavy: 900,
  black: 900,
};
/** Register atomically so failed/conflicting requests cannot silently override another output. */
export function registerFonts(fonts: any[]) {
  const additions: [string, string, any][] = [];
  for (const registration of fonts) {
    if (!registration || typeof registration.family !== "string")
      throw new Error("Font registration requires family.");
    const sources = registration.fonts ?? [
      { ...registration, family: undefined },
    ];
    if (!Array.isArray(sources) || !sources.length)
      throw new Error("Font fonts must be a nonempty list.");
    for (const source of sources) {
      if (typeof source.src !== "string")
        throw new Error("Font src must be a browser URL or data URL.");
      const weight =
        typeof source.fontWeight === "string"
          ? weights[source.fontWeight]
          : (source.fontWeight ?? 400);
      if (!Number.isFinite(weight)) throw new Error("Unknown font weight.");
      const key = JSON.stringify([
        registration.family,
        source.fontStyle ?? "normal",
        weight,
      ]);
      const signature = JSON.stringify({
        ...source,
        fontWeight: weight,
        fontStyle: source.fontStyle ?? "normal",
      });
      const previous =
        variants.get(key) ?? additions.find((item) => item[0] === key)?.[1];
      if (previous && previous !== signature)
        throw new Error(
          `Conflicting font source for ${registration.family} ${source.fontStyle ?? "normal"} ${weight}. Use a distinct family name.`,
        );
      if (!previous)
        additions.push([
          key,
          signature,
          { ...source, family: registration.family },
        ]);
    }
  }
  for (const [key, signature, font] of additions) {
    Font.register(font);
    variants.set(key, signature);
  }
}
export async function configureFonts(
  config: any,
  context: Record<string, any>,
) {
  if (config.fontAction === "clear") {
    // clear removes standard families too; restore renderer defaults for usable subsequent output.
    const fresh = new (Font as any).constructor();
    Font.clear();
    Object.assign(Font.getRegisteredFonts(), fresh.getRegisteredFonts());
    variants.clear();
  }
  if (config.fontAction === "reset") Font.reset();
  registerFonts(config.fonts ?? []);
  if (config.fontAction === "load")
    for (const descriptor of config.fontDescriptors ?? [])
      await Font.load(descriptor);
  const previousHyphenation = Font.getHyphenationCallback(),
    previousEmoji = Font.getEmojiSource();
  const callback = config.hyphenationCallback
    ? resolveFunction(config.hyphenationCallback, context)
    : null;
  Font.registerHyphenationCallback(
    (callback
      ? (word: string) => {
          const result = callback(word);
          if (
            !Array.isArray(result) ||
            result.some((v) => typeof v !== "string")
          )
            throw new Error(
              "Global hyphenationCallback must return a string list.",
            );
          return result;
        }
      : null) as any,
  );
  const emoji = config.emojiSource ? { ...config.emojiSource } : null;
  try {
    if (emoji?.builder)
      emoji.builder = resolveFunction(emoji.builder, callbackContext(context));
    Font.registerEmojiSource(emoji as any);
  } catch (error) {
    Font.registerHyphenationCallback(previousHyphenation as any);
    throw error;
  }
  return () => {
    Font.registerHyphenationCallback(previousHyphenation as any);
    Font.registerEmojiSource(previousEmoji as any);
  };
}
export function fontDiagnostics(descriptors: any[] = []) {
  const sources = Object.fromEntries(
    Object.entries(Font.getRegisteredFonts()).map(([family, font]) => [
      family,
      (font as any).sources.map((s: any) => ({
        src: s.src,
        fontStyle: s.fontStyle,
        fontWeight: s.fontWeight,
        loaded: !!s.data,
      })),
    ]),
  );
  const selected = descriptors.map((descriptor) => {
    const s = Font.getFont(descriptor) as any;
    return {
      ...descriptor,
      src: s.src,
      fontStyle: s.fontStyle,
      fontWeight: s.fontWeight,
      loaded: !!s.data,
    };
  });
  return {
    fontFamilies: Font.getRegisteredFontFamilies(),
    fontInfo: { sources, selected },
  };
}
