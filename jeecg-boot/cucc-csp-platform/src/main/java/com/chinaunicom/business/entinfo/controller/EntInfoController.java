package com.chinaunicom.business.entinfo.controller;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chinaunicom.business.entinfo.entity.EntInfo;
import com.chinaunicom.business.entinfo.service.IEntInfoService;
import com.chinaunicom.business.entinfo.vo.EntInfoDetailVO;
import com.chinaunicom.constants.StatusConstant;
import com.chinaunicom.validation.PermissionCheck;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * <p>
 * 企业客户信息表 前端控制器
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
@Slf4j
@Api(tags = "企业客户信息")
@RestController
@RequestMapping("/entInfo")
public class EntInfoController {

    @Autowired
    private IEntInfoService entInfoService;

    @ApiOperation(value = "获取企业详细信息", notes = "获取企业详细信息，包含企业干系人、合同等信息")
    @GetMapping("/get")
    public Result get(@RequestParam String entId) {
        try {
            return Result.OK(entInfoService.getEntInfo(entId));
        } catch (Exception e) {
            log.error("/entInfo/get 接口异常：{}", e);
            return Result.error("获取企业信息失败");
        }
    }

    @ApiOperation(value = "新增企业信息", notes = "新增企业信息")
    @PostMapping("/save")
    public Result save(@Valid @RequestBody EntInfoDetailVO entInfoDetail) {
        try {
            //校验权限，只有管理员才具备创建权限
            if (!PermissionCheck.isAdmin()) {
                return Result.error("权限不足");
            }
            entInfoService.saveEntInfo(entInfoDetail);
            return Result.OK();
        } catch (Exception e) {
            log.error("/entInfo/save 接口异常：{}", e);
            return Result.error("保存企业信息失败");
        }
    }

    @ApiOperation(value = "更新企业信息", notes = "更新企业信息")
    @PostMapping("/update")
    public Result update(@Valid @RequestBody EntInfoDetailVO entInfoDetail) {
        try {
            if (StringUtils.isEmpty(entInfoDetail.getEntInfo().getEntId())) {
                return Result.error("参数错误");
            }
            entInfoService.updateEntInfo(entInfoDetail);
            return Result.OK();
        } catch (Exception e) {
            log.error("/entInfo/update 接口异常：{}", e);
            return Result.error("更新企业信息失败");
        }
    }


    @ApiOperation(value = "分页列表查询", notes = "查询分页列表信息")
    @GetMapping("/list")
    public Result list(EntInfo entInfo, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        try {
            Page page = new Page(pageNo, pageSize);
            return Result.OK(entInfoService.pageList(entInfo, page));
        } catch (Exception e) {
            log.error("/entInfo/list 接口异常：{}", e);
            return Result.error("查询列表失败");
        }
    }

    @ApiOperation(value = "查询所有企业(权限范围内)", notes = "查询所有企业(权限范围内)")
    @GetMapping("/listAll")
    public Result listAll() {
        try {
            LoginUser sysUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
            LambdaQueryWrapper<EntInfo> queryWrapper = new LambdaQueryWrapper<>(EntInfo.class).eq(EntInfo::getStatus, StatusConstant.STATUS_ENABLED);
            if (!StringUtils.isEmpty(sysUser.getEntId())) {
                queryWrapper.eq(EntInfo::getEntId, sysUser.getEntId());
            }
            return Result.OK(entInfoService.list(queryWrapper));
        } catch (Exception e) {
            log.error("/entInfo/listAll 接口异常：{}", e);
            return Result.error("查询所有企业失败");
        }
    }

    @ApiOperation(value = "启用/停用企业", notes = "启用/停用企业")
    @PostMapping("/updateStatus")
    public Result updateStatus(@RequestBody EntInfo entInfo) {
        try {
            if (StringUtils.isEmpty(entInfo.getEntId()) || entInfo.getStatus() == null) {
                return Result.error("参数错误");
            }
            if (!checkStatus(entInfo.getStatus())) {
                return Result.error("状态无效");
            }
            entInfoService.updateStatus(entInfo);
            return Result.OK();
        } catch (Exception e) {
            log.error("/entInfo/updateStatus 接口异常：{}", e);
            return Result.error("启用/停用企业失败");
        }
    }

    /**
     * 状态校验
     *
     * @param status
     * @return
     */
    private boolean checkStatus(Integer status) {
        if (status == null) {
            return false;
        }
        boolean isAllowed = status.intValue() == StatusConstant.STATUS_ENABLED || status.intValue() == StatusConstant.STATUS_DISABLED;
        if (!isAllowed) {
            return false;
        }
        return true;
    }

}

