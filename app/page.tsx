"use client"; // Next.js 需要明确它是 Client Component
import React, { useState } from 'react';
import { Drawer, Splitter} from 'antd';

import UploadViewer from "@/app/components/uploadViewer/uploadViewer";
import ImageListViewer from "@/app/components/imageList/imageList";
import PdfViewer from "@/app/components/pdfViewer/pdfViewer";
import OperatorViewer from "@/app/components/operatorViewer/operatorViewer";

interface ImageItem {
	path: string;
	name: string;
}


const App: React.FC = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [pdfUrl, setPdfUrl] = useState('');
	const [imageListUrl, setImageListUrl] = useState<ImageItem[]>([]);
	const [ocrText, setOcrText] = useState<string>("");
	const [isOcrEnabled, setIsOcrEnabled] = useState<boolean>(false);

	const showDrawer = () => {
		setDrawerOpen(true);
	};
	const onDrawerClose = () => {
		setDrawerOpen(false);
	};
	const refreshPdfUrl = (pdfUrl: string,imageUrlList: ImageItem[]) => {
		setPdfUrl(pdfUrl);
		setImageListUrl(imageUrlList)
		onDrawerClose()
	};

	const refreshOcrText = (text: string) => {
		setOcrText(text);
		console.log("text",text)
	}

	const refreshOcrMode = (mode: boolean) => {
		setIsOcrEnabled(mode);
	}

	return (
		<div style={{ height: '100vh'}}>
			<Drawer placement='top' closable={false} onClose={onDrawerClose} open={drawerOpen}>
				{/*拖拽上传框*/}
				<UploadViewer refreshPdfUrl={(pdfUrl:string, imageUrlList: ImageItem[]) => refreshPdfUrl(pdfUrl, imageUrlList)}/>
			</Drawer>
			<Splitter style={{ height: '100%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
				<Splitter.Panel defaultSize="20%" min="10%">
					<ImageListViewer imageUrlList={imageListUrl} showDrawer={showDrawer}/>
				</Splitter.Panel>
				<Splitter.Panel defaultSize="60%" min="10%">
					<PdfViewer file={pdfUrl} refreshOcrText={refreshOcrText} refreshOcrMode={refreshOcrMode}/>
				</Splitter.Panel>
				<Splitter.Panel defaultSize="20%" min="10%">
					<OperatorViewer ocrText={ocrText} isOcrEnabled={isOcrEnabled}/>
				</Splitter.Panel>
			</Splitter>
		</div>
	);
}

export default App;