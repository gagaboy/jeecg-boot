package com.chinaunicom.business.chatbot.controller;


import com.chinaunicom.business.chatbot.entity.ChatbotMenu;
import com.chinaunicom.business.chatbot.service.IChatbotMenuService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * <p>
 * chatbot账号固定菜单 前端控制器
 * </p>
 *
 * @author 木头人
 * @since 2021-06-23
 */
@Slf4j
@Api(tags = "chatbot固定菜单管理")
@RestController
@RequestMapping("/chatbot/menu")
public class ChatbotMenuController {

    @Autowired
    private IChatbotMenuService chatbotAccountMenuService;

    @ApiOperation(value = "新增固定菜单", notes = "为chatbot新增固定菜单")
    @PostMapping("/save")
    public Result save(@RequestBody @Valid ChatbotMenu chatbotMenu) {
        try {
            if (StringUtils.isEmpty(chatbotMenu.getChatbotId())) {
                return Result.error("参数错误");
            }
            chatbotAccountMenuService.saveMenu(chatbotMenu);
            return Result.OK();
        } catch (Exception e) {
            log.error("/chatbot/menu/save 接口异常：{}", e);
            return Result.error("保存菜单失败");
        }
    }

    @ApiOperation(value = "更新固定菜单", notes = "更新chatbot固定菜单")
    @PostMapping("/update")
    public Result update(@RequestBody @Valid ChatbotMenu chatbotMenu) {
        try {
            if (StringUtils.isEmpty(chatbotMenu.getMenuId())) {
                return Result.error("参数错误");
            }
            chatbotAccountMenuService.updateById(chatbotMenu);
            return Result.OK();
        } catch (Exception e) {
            log.error("/chatbot/menu/save 接口异常：{}", e);
            return Result.error("更新菜单失败");
        }
    }

    @ApiOperation(value = "获取固定菜单信息", notes = "获取固定菜单信息")
    @GetMapping("/get")
    public Result get(@RequestParam String chatbotId) {
        try {
            return Result.OK(chatbotAccountMenuService.lambdaQuery().eq(ChatbotMenu::getChatbotId, chatbotId).one());
        } catch (Exception e) {
            log.error("/chatbot/menu/get 接口异常：{}", e);
            return Result.error("获取菜单信息失败");
        }
    }
}

