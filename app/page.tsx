"use client"; // ✅ 关键一步，Next.js 需要明确它是 Client Component
import React, { useState } from 'react';
import { Drawer, Flex, Splitter, Typography} from 'antd';

import UploadButton from "@/app/components/uploadButton";
import UploadViewer from "@/app/components/uploadViewer/uploadViewer";
import ImageListViewer from "@/app/components/imageList/imageList";
import PdfViewer from "@/app/components/pdfViewer/pdfViewer";


const App: React.FC = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [pdfUrl, setPdfUrl] = useState('');
	const [imageListUrl, setImageListUrl] = useState<string[]>([]);

	const showDrawer = () => {
		setDrawerOpen(true);
	};
	const onDrawerClose = () => {
		setDrawerOpen(false);
	};
	const refreshPdfUrl = (pdfUrl: string,imageUrlList: string[]) => {
		console.log("imageUrlList",imageUrlList)
		console.log("pdfUrl",pdfUrl)
		setPdfUrl(pdfUrl);
		setImageListUrl(imageUrlList)
		onDrawerClose()
	}
	console.log("App.pdfUrl",pdfUrl)

	return (
		<div style={{ height: '100vh' }}>

			<Drawer placement='top' closable={false} onClose={onDrawerClose} open={drawerOpen}>
				{/*拖拽上传框*/}
				<UploadViewer refreshPdfUrl={(pdfUrl:string, imageUrlList: string[]) => refreshPdfUrl(pdfUrl, imageUrlList)}/>
			</Drawer>
			<Splitter style={{ height: '98%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
				<Splitter.Panel defaultSize="20%" min="10%">
					<UploadButton onClick={showDrawer}/>
					<ImageListViewer imageUrlList={imageListUrl}></ImageListViewer>
				</Splitter.Panel>
				<Splitter.Panel defaultSize="60%" min="10%">
					<PdfViewer file={pdfUrl} />
				</Splitter.Panel>
				<Splitter.Panel defaultSize="20%" min="10%">
					<Flex justify="center" align="center" style={{ height: '100%' }}>
						<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
							操作界面
						</Typography.Title>
					</Flex>
				</Splitter.Panel>
			</Splitter>
		</div>
	);
}

export default App;