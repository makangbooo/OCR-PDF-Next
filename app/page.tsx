"use client"; // ✅ 关键一步，Next.js 需要明确它是 Client Component
import React, { useState } from 'react';
import {InboxOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {FileTextOutlined} from '@ant-design/icons';
import { AntDesignOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

import {message, Upload, FloatButton, Drawer, Flex, Splitter, Typography,Button} from 'antd';

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
const useStyle = createStyles(({ prefixCls, css }) => ({
	linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));


const App: React.FC = () => {
	const [open, setOpen] = useState(false);
	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};
	const { styles } = useStyle();

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

					<Button
						icon={<AntDesignOutlined />}
						type="primary"
						size="large"
						block
						className={styles.linearGradientButton}
						onClick={showDrawer}
					>
						开始上传文件
					</Button>
					<Flex justify="center" align="center" style={{ height: '100%' }}>
						<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
							原始文件
						</Typography.Title>
					</Flex>

				</Splitter.Panel>
				<Splitter.Panel defaultSize="60%" min="10%">
					<Flex justify="center" align="center" style={{ height: '100%' }}>
						<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
							pdf预览
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