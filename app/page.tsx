"use client"; // ✅ 关键一步，Next.js 需要明确它是 Client Component
import React, { useState } from 'react';
import {FileTextOutlined} from '@ant-design/icons';

import { FloatButton, Drawer, Flex, Splitter, Typography,Button} from 'antd';
import UploadButton from "@/app/components/uploadButton";
import PdfViewer from "@/app/components/pdfPreviewer/page";
import UploadViewer from "@/app/components/uploadViewer/uploadViewer";


const App: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [pdfUrl, setPdfUrl] = useState(false);
	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};
	const refreshPdfUrl = (url) => {
		setPdfUrl(url);
	}

	return (
		<>
			<Drawer
				placement='top'
				closable={false}
				onClose={onClose}
				open={open}
			>
				{/*拖拽上传框*/}
				<UploadViewer refreshPdfUrl={refreshPdfUrl}/>
			</Drawer>
			<Splitter style={{ height: 800, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
				<Splitter.Panel defaultSize="20%" min="10%">
					<UploadButton onClick={showDrawer}/>
					<Flex justify="center" align="center" style={{ height: '100%' }}>
						<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
							原始文件
						</Typography.Title>
					</Flex>

				</Splitter.Panel>
				<Splitter.Panel defaultSize="60%" min="10%">
					<Flex justify="center" align="center" style={{ height: '100%' }}>
						<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
							{/*<PdfViewer pdfurl={pdfUrl}/>*/}
							{pdfUrl && (
							<div className="mt-4">
								<h2 className="text-xl">OCR 生成的 PDF：</h2>
								<iframe src={pdfUrl} width="100%" height="600px" className="border rounded"></iframe>
							</div>
							)}
						</Typography.Title>
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
			<FloatButton
				icon={<FileTextOutlined/>}
				description="上传文件"
				type="primary"
				shape="square"
				style={{insetInlineEnd: 24}}
				onClick={showDrawer}
			/>

		</>
	);
}

export default App;