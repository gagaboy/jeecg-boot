package com.chinaunicom.common.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.modules.system.entity.SysDict;
import org.jeecg.modules.system.service.ISysDictItemService;
import org.jeecg.modules.system.service.ISysDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
  * @description 服务大区管理
  *
  * @author 木头人
  * @date 2021/6/21 10:15
  * @version 1.0
  */
@Api(tags = "大区管理")
@RestController
@RequestMapping("/region")
public class RegionController {

    @Autowired
    private ISysDictService sysDictService;

    @Autowired
    private ISysDictItemService sysDictItemService;

    @ApiOperation(value = "获取大区列表", notes = "获取大区列表")
    @GetMapping("/listAll")
    public Result listAll() {
        SysDict sysDict = sysDictService.getOne(new LambdaQueryWrapper<>(SysDict.class).eq(SysDict::getDictCode, com.chinaunicom.constants.CommonConstant.SysDictItemConstant.CSP_REGION).eq(SysDict::getDelFlag, CommonConstant.DEL_FLAG_0));
        if (sysDict == null) {
            return Result.error("未配置大区信息");
        }

        return Result.OK(sysDictItemService.selectItemsByMainId(sysDict.getId()));
    }
}
