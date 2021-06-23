package com.chinaunicom.business.serviceregion.controller;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chinaunicom.business.serviceregion.entity.ServiceRegion;
import com.chinaunicom.business.serviceregion.service.IServiceRegionService;
import com.chinaunicom.business.serviceregion.vo.ServiceRegionVO;
import com.chinaunicom.constants.StatusConstant;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * <p>
 * 运营商大区表 前端控制器
 * </p>
 *
 * @author 木头人
 * @since 2021-06-21
 */
@Slf4j
@Api(tags = "服务大区管理")
@RestController
@RequestMapping("/serviceRegion")
public class ServiceRegionController {

    @Autowired
    private IServiceRegionService serviceRegionService;

    @ApiOperation(value = "新增服务大区", notes = "新增服务大区")
    @PostMapping("/save")
    public Result save(@RequestBody @Valid ServiceRegion serviceRegion) {
        try {
            serviceRegionService.saveServiceRegion(serviceRegion);
            return Result.OK();
        } catch (Exception e) {
            log.error("/serviceRegion/save 接口异常：{}", e);
            return Result.error("保存服务大区信息失败");
        }
    }

    @ApiOperation(value = "查询服务大区信息", notes = "查询服务大区信息")
    @GetMapping("/get")
    public Result get(@RequestParam String id) {
        try {
            return Result.OK(serviceRegionService.getOne(new LambdaQueryWrapper<>(ServiceRegion.class).eq(ServiceRegion::getId, id).ne(ServiceRegion::getStatus, StatusConstant.STATUS_DELETE)));
        } catch (Exception e) {
            log.error("/serviceRegion/get 接口异常：{}", e);
            return Result.error("查询服务大区信息失败");
        }
    }

    @ApiOperation(value = "更新服务大区信息", notes = "更新服务大区信息")
    @PostMapping("/update")
    public Result update(@RequestBody @Valid ServiceRegion serviceRegion) {
        try {
            if (StringUtils.isEmpty(serviceRegion.getId())) {
                return Result.error("参数错误");
            }
            serviceRegionService.updateServiceRegion(serviceRegion);
            return Result.OK();
        } catch (Exception e) {
            log.error("/serviceRegion/update 接口异常：{}", e);
            return Result.error("更新服务大区信息失败");
        }
    }

    @ApiOperation(value = "列表查询", notes = "查询分页列表信息")
    @GetMapping("/list")
    public Result list(ServiceRegionVO serviceRegionVO, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        try {
            Page page = new Page(pageNo, pageSize);
            return Result.OK(serviceRegionService.pageList(serviceRegionVO, page));
        } catch (Exception e) {
            log.error("/serviceRegion/list 接口异常：{}", e);
            return Result.error("查询服务大区列表失败");
        }
    }

    @ApiOperation(value = "删除服务大区", notes = "删除服务大区")
    @DeleteMapping("/delete")
    public Result delete(@RequestParam String id) {
        try {
            boolean result = serviceRegionService.lambdaUpdate().set(ServiceRegion::getStatus, StatusConstant.STATUS_DELETE).eq(ServiceRegion::getId, id).update();
            Assert.isTrue(result, "删除服务大区失败");
            return Result.OK();
        } catch (Exception e) {
            log.error("/serviceRegion/delete 接口异常：{}", e);
            return Result.error("删除服务大区失败");
        }
    }

    @ApiOperation(value = "查询指定运营商大区", notes = "查询指定运营商大区")
    @GetMapping("/listByOperator")
    public Result listByOperator(@RequestParam String operatorId) {
        try {
            return Result.OK(serviceRegionService.lambdaQuery().eq(ServiceRegion::getOperatorId, operatorId).eq(ServiceRegion::getStatus, StatusConstant.STATUS_ENABLED).list());
        } catch (Exception e) {
            log.error("/serviceRegion/listByOperator 接口异常：{}", e);
            return Result.error("查询大区列表失败");
        }
    }

    @ApiOperation(value = "查询指定服务大区关联的省份", notes = "查询指定服务大区关联的省份")
    @GetMapping("/listProvinceByServiceRegion")
    public Result listProvinceByServiceRegion(@RequestParam String serviceRegionId) {
        try {
            return Result.OK(serviceRegionService.listProvinceByServiceRegion(serviceRegionId));
        } catch (Exception e) {
            log.error("/serviceRegion/listProvinceByServiceRegion 接口异常：{}", e);
            return Result.error("查询定服务大区关联的省份");
        }
    }
}

