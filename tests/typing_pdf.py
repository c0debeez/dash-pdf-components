from dash_pdf_components import PDF

viewer_from_url = PDF(file={"url": "/assets/document.pdf"})
viewer_from_data = PDF(file={"data": [37, 80, 68, 70]}, pageNumber=1)
