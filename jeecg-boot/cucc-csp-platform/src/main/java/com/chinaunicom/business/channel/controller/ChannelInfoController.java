package com.chinaunicom.business.channel.controller;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chinaunicom.business.channel.entity.ChannelInfo;
import com.chinaunicom.business.channel.service.IChannelInfoService;
import com.chinaunicom.business.channel.vo.ChannelInfoVO;
import com.chinaunicom.constants.StatusConstant;
import com.chinaunicom.validation.PermissionCheck;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.modules.system.entity.SysDict;
import org.jeecg.modules.system.service.ISysDictItemService;
import org.jeecg.modules.system.service.ISysDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * <p>
 *  通道信息前端控制器
 * </p>
 *
 * @author 木头人
 * @since 2021-06-23
 */
@Api(tags = "通道管理")
@Slf4j
@RestController
@RequestMapping("/channel")
public class ChannelInfoController {

    @Autowired
    private IChannelInfoService channelInfoService;

    @Autowired
    private ISysDictService sysDictService;

    @Autowired
    private ISysDictItemService sysDictItemService;

    @ApiOperation(value = "获取通道类型列表", notes = "获取通道类型列表")
    @GetMapping("/channelTypeList")
    public Result channelTypeList() {
        SysDict sysDict = sysDictService.getOne(new LambdaQueryWrapper<>(SysDict.class).eq(SysDict::getDictCode, com.chinaunicom.constants.CommonConstant.SysDictItemConstant.CSP_CHANNEL_TYPE).eq(SysDict::getDelFlag, CommonConstant.DEL_FLAG_0));
        if (sysDict == null) {
            return Result.error("未配置通道类型信息");
        }

        return Result.OK(sysDictItemService.selectItemsByMainId(sysDict.getId()));
    }

    @ApiOperation(value = "新增通道信息", notes = "新增通道信息")
    @PostMapping("/save")
    public Result save(@RequestBody @Valid ChannelInfoVO channelInfoVO) {
        try {
            //校验权限，管理员不具备创建权限
            if (PermissionCheck.isAdmin()) {
                return Result.error("权限不足");
            }
            channelInfoService.saveChannelInfo(channelInfoVO);
            return Result.OK();
        } catch (Exception e) {
            log.error("/channel/save 接口异常：{}", e);
            return Result.error(e.getMessage());
        }
    }

    @ApiOperation(value = "更新通道信息", notes = "更新通道信息")
    @PostMapping("/update")
    public Result update(@RequestBody @Valid ChannelInfoVO channelInfoVO) {
        try {
            if (StringUtils.isEmpty(channelInfoVO.getChannelId())) {
                return Result.error("参数错误");
            }
            channelInfoService.updateChannelInfo(channelInfoVO);
            return Result.OK();
        } catch (Exception e) {
            log.error("/channel/update 接口异常：{}", e);
            return Result.error(e.getMessage());
        }
    }

    @ApiOperation(value = "获取通道信息列表", notes = "获取通道信息分页列表")
    @GetMapping("/list")
    public Result list(ChannelInfoVO channelInfoVO, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        try {
            Page page = new Page(pageNo, pageSize);
            return Result.OK(channelInfoService.pageList(channelInfoVO, page));
        } catch (Exception e) {
            log.error("/channel/list 接口异常：{}", e);
            return Result.error("查询通道信息列表失败");
        }
    }

    @ApiOperation(value = "获取全部通道信息", notes = "获取全部通道信息")
    @GetMapping("/listAll")
    public Result listAll() {
        try {
            return Result.OK(channelInfoService.list(new LambdaQueryWrapper<>(ChannelInfo.class).eq(ChannelInfo::getStatus, StatusConstant.STATUS_ENABLED)));
        } catch (Exception e) {
            log.error("/channel/listAll 接口异常：{}", e);
            return Result.error("获取全部通道信息失败");
        }
    }

    @ApiOperation(value = "删除通道信息", notes = "删除通道信息")
    @DeleteMapping("/deleteById")
    public Result deleteById(@RequestParam String channelId) {
        try {
            channelInfoService.deleteById(channelId);
            return Result.OK();
        } catch (Exception e) {
            log.error("/channel/deleteById 接口异常：{}", e);
            return Result.error("删除通道信息失败");
        }
    }

    @ApiOperation(value = "批量删除通道信息", notes = "批量删除通道信息")
    @DeleteMapping("/deleteByBatch")
    public Result deleteByBatch(@RequestParam("channelIds") List<String> channelIdList) {
        try {
            channelInfoService.deleteByBatch(channelIdList);
            return Result.OK();
        } catch (Exception e) {
            log.error("/channel/deleteByBatch 接口异常：{}", e);
            return Result.error("批量删除通道信息失败");
        }
    }
}

