package com.chinaunicom.constants;

/**
 * @author 木头人
 * @version 1.0
 * @description 状态常量定义
 * @date 2021/6/3 15:22
 */
public class StatusConstant {

    /**
     * 启用，正常
     */
    public static final Integer STATUS_ENABLED = 0;

    /**
     * 禁用
     */
    public static final Integer STATUS_DISABLED = 1;

    /**
     * 删除
     */
    public static final Integer STATUS_DELETE = -1;

    /**
     * 审核状态
     */
    /**
     * 审核中
     */
    public static final Integer AUDITING = 0;

    /**
     * 审核通过
     */
    public static final Integer PASSED = 1;

    /**
     * 审核不通过
     */
    public static final Integer REJECT = -1;
}
