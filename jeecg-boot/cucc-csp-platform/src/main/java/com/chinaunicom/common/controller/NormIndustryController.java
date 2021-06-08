package com.chinaunicom.common.controller;


import com.chinaunicom.common.service.INormIndustryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.jeecg.common.api.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 标准行业表(GB/T 4754-2017) 前端控制器
 * </p>
 *
 * @author 木头人
 * @since 2021-06-08
 */
@Api(tags = "行业分类管理")
@RestController
@RequestMapping("/industry")
public class NormIndustryController {

    @Autowired
    private INormIndustryService normIndustryService;

    @ApiOperation(value = "获取行业分类信息", notes = "获取行业分类信息")
    @GetMapping("/list")
    public Result list() {

        return Result.OK(normIndustryService.listIndustryCascade());
    }
}

