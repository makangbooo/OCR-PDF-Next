import React, { useState } from 'react';
import {createStyles} from "antd-style";
import {Button} from "antd";
import {AntDesignOutlined} from "@ant-design/icons";
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


// 渐变色按钮
const UploadButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
	const { styles } = useStyle();

	return(
	<Button
		icon={<AntDesignOutlined />}
		type="primary"
		size="large"
		block
		className={styles.linearGradientButton}
		//onClick为父组件传递的方法
		onClick={onClick}
		// onClick ={() => {
		// 	window.location.href = '/components/pdfPreviewer';
		// }}
	>
		开始上传文件
	</Button>
	)
}
export default UploadButton;