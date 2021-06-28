package com.chinaunicom.validation;

import org.apache.shiro.SecurityUtils;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.util.StringUtils;

/**
 * @author 木头人
 * @version 1.0
 * @description
 * @date 2021/6/25 10:50
 */
public class PermissionCheck {

    /**
     * 校验是否为管理员（通过判断登录用户是否属于某个企业来判断，适用于某些接口管理员不具体权限时使用）
     *
     * @return
     */
    public static boolean isAdmin() {
        //获取当前登录用户
        LoginUser sysUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (StringUtils.isEmpty(sysUser)) {
            return true;
        }
        return false;
    }
}
