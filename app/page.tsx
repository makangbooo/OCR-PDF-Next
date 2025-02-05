"use client"; // ✅ 关键一步，Next.js 需要明确它是 Client Component
import React, { useState } from 'react';
import {InboxOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {FileTextOutlined} from '@ant-design/icons';

import {message, Upload, FloatButton, Drawer, Flex, Splitter, Typography,Button} from 'antd';
import UploadButton from "@/app/components/uploadButton";
import PdfViewer from "@/app/components/pdfPreviewer/page";

const {Dragger} = Upload;

const props: UploadProps = {
	name: 'file',
	multiple: true,
	action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',

	onChange(info) {
		const {status} = info.file;
		if (status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (status === 'done') {
			message.success(`${info.file.name} file uploaded successfully.`);
		} else if (status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	},
	onDrop(e) {
		console.log('Dropped files', e.dataTransfer.files);
	},
};


const App: React.FC = () => {
	const [open, setOpen] = useState(false);
	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Drawer
				placement='top'
				closable={false}
				onClose={onClose}
				open={open}
			>
				<Dragger {...props}>
					<p className="ant-upload-drag-icon">
						<InboxOutlined/>
					</p>
					<p className="ant-upload-text">Click or drag file to this area to upload</p>
					<p className="ant-upload-hint">
						Support for a single or bulk upload. Strictly prohibited from uploading company data or other
						banned files.
					</p>
				</Dragger>
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
							<PdfViewer/>
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