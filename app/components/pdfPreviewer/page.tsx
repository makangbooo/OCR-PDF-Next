"use client";

import {useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// 设置 workerSrc 为本地路径
pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";


export default function PdfViewer(pdfUrl) {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	console.log("PdfViewer:",pdfUrl);

	return (
		<div className="flex flex-col items-center">
			{/*{pdfUrl && (*/}
				<div className="mt-4">
					<h2 className="text-xl">OCR 生成的 PDF：</h2>
					<iframe src={pdfUrl} width="100%" height="600px" className="border rounded"></iframe>
				</div>
			{/*)}*/}
			{/*<Document*/}
			{/*	file="/大模型微调综述.pdf"*/}
			{/*	onLoadSuccess={({numPages}) => setNumPages(numPages)}*/}
			{/*>*/}
			{/*	<Page pageNumber={pageNumber}/>*/}
			{/*</Document>*/}
			{/*<div className="mt-2">*/}
			{/*	<button disabled={pageNumber <= 1} onClick={() => setPageNumber(p => p - 1)}>*/}
			{/*		上一页*/}
			{/*	</button>*/}
			{/*	<span className="mx-2">*/}
			{/*	  {pageNumber} / {numPages}*/}
			{/*	</span>*/}
			{/*	<button disabled={pageNumber >= numPages} onClick={() => setPageNumber(p => p + 1)}>*/}
			{/*		下一页*/}
			{/*	</button>*/}
			{/*</div>*/}
		</div>
	);
}