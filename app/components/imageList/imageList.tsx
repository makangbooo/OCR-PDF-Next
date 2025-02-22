import React from 'react';
import {Divider, Flex, Image, Typography} from 'antd';
interface ImageListProps {
	imageUrlList: string[]; // 图片 URL 列表
}

const ImageListViewer: React.FC<ImageListProps> = ({ imageUrlList }) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%',width:"100%" }}>
		{imageUrlList.length === 0 ?
            <Flex justify="center" align="center" style={{ height: '100%' }}>
              <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
                原始文件
              </Typography.Title>
            </Flex>
			:
			imageUrlList.map((url, index) => (
					<>
						<Image
							width={'100%'}
							src={url}
							key={index}
							alt={`image-${index}`}
						/>
						<Divider />
					</>
			))
		}

		</div>
	);
};

export default ImageListViewer;