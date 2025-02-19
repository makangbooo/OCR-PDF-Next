"use client"; // ✅ 关键一步，Next.js 需要明确它是 Client Component
import React, { useState } from 'react';
// import {FileTextOutlined} from '@ant-design/icons';

import {Button, Drawer, Flex, Space, Splitter, Typography} from 'antd';
import UploadButton from "@/app/components/uploadButton";
// import PdfViewer from "@/app/components/pdfPreviewer/page";
import UploadViewer from "@/app/components/uploadViewer/uploadViewer";
import ImageList from "@/app/components/imageList/imageList";


const App: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [pdfUrl, setPdfUrl] = useState('');
	const [imageListUrl, setImageListUrl] = useState<string[]>([]);
	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};
	const refreshPdfUrl = (pdfUrl: string,imageUrlList: string[]) => {
		console.log("imageUrlList",imageUrlList)
		console.log("pdfUrl",pdfUrl)
		setPdfUrl(pdfUrl);
		setImageListUrl(imageUrlList)
		onClose()
	}

	return (
		<div style={{ height: '100vh' }}>

			<Drawer
				placement='top'
				closable={false}
				onClose={onClose}
				open={open}
			>
				{/*拖拽上传框*/}
				<UploadViewer refreshPdfUrl={(pdfUrl:string,imageUrlList: string[]) => refreshPdfUrl(pdfUrl,imageUrlList)}/>
			</Drawer>
			<Splitter style={{ height: '98%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
				<Splitter.Panel defaultSize="20%" min="10%">
					<UploadButton onClick={showDrawer}/>
					<ImageList imageUrlList={imageListUrl}></ImageList>
					{imageListUrl.length === 0 &&
						<Flex justify="center" align="center" style={{ height: '100%' }}>
							<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
								原始文件
							</Typography.Title>
						</Flex>
					}


				</Splitter.Panel>
				<Splitter.Panel defaultSize="60%" min="10%">
					<Flex justify="center" align="center" style={{ height: '100%',width:"100%" }}>
						{
							pdfUrl ?
								<div style={{ height: '100%',width:"100%"  }}>
									{/*<h2 className="text-xl">OCR 生成的 PDF：</h2>*/}
									<iframe src={pdfUrl} width={'100%'} height={'100%'} className="border rounded"></iframe>
								</div>:
								<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
									pdf文件
								</Typography.Title>
						}




						{/*<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>*/}
							{/*<PdfViewer pdfurl={pdfUrl}/>*/}
							{/*{pdfUrl && (*/}
							{/*<div style={{ height: '100%',width:"100%"  }}>*/}
							{/*	<h2 className="text-xl">OCR 生成的 PDF：</h2>*/}
							{/*	<iframe src={pdfUrl} width={'100%'} height={'100%'} className="border rounded"></iframe>*/}
							{/*</div>*/}
							{/*)}*/}
						{/*</Typography.Title>*/}
					</Flex>
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