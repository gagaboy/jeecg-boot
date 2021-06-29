package com.chinaunicom.constants;

/**
  * @description 通用常量定义
  *
  * @author 木头人
  * @date 2021/6/15 11:51
  * @version 1.0
  */
public class CommonConstant {

    /**
     * 素材相关常量定义
     */
    public static class MaterialConstant {
        /**
         * 素材文件
         */
        public static final String FILE_TYPE_RESOURCE = "resource";
        /**
         * 缩略图文件
         */
        public static final String FILE_TYPE_THUMBNAIL = "thumbnail";

        /**
         * 素材文件上传路径
         */
        public static final String UPLOAD_PATH_RESOURCE = "/material/resource";
        /**
         * 缩略图文件上传路径
         */
        public static final String UPLOAD_PATH_THUMBNAIL = "/material/thumbnail";

        /**
         * 素材来源：本地
         */
        public static final String MATERIAL_SOURCE_LOCAL = "local";

        /**
         * 素材来源：编辑器
         */
        public static final String MATERIAL_SOURCE_EDITOR = "editor";
    }

    public static class OperatorConstant {
        /**
         * 中国联通
         */
        public static final String OPERATOR_CUCC = "CUCC";

        /**
         * 中国移动
         */
        public static final String OPERATOR_CMCC = "CMCC";

        /**
         * 中国电信
         */
        public static final String OPERATOR_CTCC = "CTCC";
    }

    public static class SysDictItemConstant {
        /**
         * csp 运营商
         */
        public static final String CSP_OPERATOR = "csp_operator";

        /**
         * csp 5g大区
         */
        public static final String CSP_REGION = "csp_region";

        public static final String CSP_CHANNEL_TYPE = "channel_type";
    }
}
