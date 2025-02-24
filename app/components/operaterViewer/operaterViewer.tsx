import React from "react";
import '@react-pdf-viewer/core/lib/styles/index.css';

import { Flex, Typography } from "antd";

const OperaterViewer: React.FC<{ ocrText: string,isOcrEnabled: boolean }> = ({ ocrText, isOcrEnabled }) => {


	return (
		<>
			{
				isOcrEnabled ?
					<>
						<Flex justify="center" align="center" style={{ height: '100%' }}>
							<Typography.Text>OCR 文本：</Typography.Text>
							<Typography.Text copyable>{ocrText}</Typography.Text>
						</Flex>
					</>:
					<>
						<Flex justify="center" align="center" style={{ height: '100%' }}>
							<Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
								操作界面
							</Typography.Title>
						</Flex>
					</>
			}
		</>
	)
}

export default OperaterViewer;