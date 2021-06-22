package com.chinaunicom.common.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.modules.system.entity.SysDict;
import org.jeecg.modules.system.entity.SysDictItem;
import org.jeecg.modules.system.service.ISysDictItemService;
import org.jeecg.modules.system.service.ISysDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author 木头人
 * @version 1.0
 * @description 运营商
 * @date 2021/6/21 9:56
 */
@Api(tags = "运营商管理")
@RestController
@RequestMapping("/operator")
public class OperatorController {

    @Autowired
    private ISysDictService sysDictService;

    @Autowired
    private ISysDictItemService sysDictItemService;

    @ApiOperation(value = "获取运营商列表", notes = "获取运营商列表")
    @GetMapping("/listAll")
    public Result listAll() {
        SysDict sysDict = sysDictService.getOne(new LambdaQueryWrapper<>(SysDict.class).eq(SysDict::getDictCode, com.chinaunicom.constants.CommonConstant.SysDictItemConstant.CSP_OPERATOR).eq(SysDict::getDelFlag, CommonConstant.DEL_FLAG_0));
        if (sysDict == null) {
            return Result.error("未配置运营商信息");
        }

        return Result.OK(sysDictItemService.selectItemsByMainId(sysDict.getId()));
    }
}
