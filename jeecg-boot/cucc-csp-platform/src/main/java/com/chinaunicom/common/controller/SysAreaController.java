package com.chinaunicom.common.controller;


import com.chinaunicom.common.entity.SysArea;
import com.chinaunicom.common.service.ISysAreaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.jeecg.common.api.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author 木头人
 * @since 2021-06-07
 */
@Api(tags = "区域信息")
@RestController
@RequestMapping("/sys/area")
public class SysAreaController {

    @Autowired
    private ISysAreaService sysAreaService;

    @ApiOperation(value = "获取省份信息", notes = "获取省份信息")
    @GetMapping("/provinceList")
    public Result provinceList() {
        return Result.OK(sysAreaService.lambdaQuery().select(SysArea::getId, SysArea::getName).eq(SysArea::getType, 0).list());
    }

    @ApiOperation(value = "获取城市信息", notes = "获取城市信息")
    @GetMapping("/cityList")
    public Result cityList(@RequestParam String provinceId) {
        return Result.OK(sysAreaService.lambdaQuery().select(SysArea::getId, SysArea::getName).eq(SysArea::getParentId, provinceId).list());
    }

    @ApiOperation(value = "获取地区信息", notes = "获取地区信息")
    @GetMapping("/list")
    public Result listProvinceAndCity() {
        return Result.OK(sysAreaService.listAreaCascade());
    }
}

