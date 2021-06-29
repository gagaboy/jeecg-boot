package com.chinaunicom.business.chatbot.controller;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chinaunicom.business.chatbot.entity.ChatbotAccount;
import com.chinaunicom.business.chatbot.service.IChatbotAccountService;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountCopyVO;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountVO;
import com.chinaunicom.common.service.IRegionProvinceApplService;
import com.chinaunicom.constants.StatusConstant;
import com.chinaunicom.validation.PermissionCheck;
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
 * chatbot账号信息 前端控制器
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
@Slf4j
@Api(tags = "chatbot账号管理")
@RestController
@RequestMapping("/chatbot")
public class ChatbotAccountController {

    @Autowired
    private IChatbotAccountService chatbotAccountService;

    @Autowired
    private IRegionProvinceApplService regionProvinceApplService;

    @ApiOperation(value = "新增chatbot账号", notes = "新增chatbot账号")
    @PostMapping("/save")
    public Result save(@RequestBody @Valid ChatbotAccount chatbotAccount) {
        try {
            //校验权限，管理员不具备创建权限
            if (PermissionCheck.isAdmin()) {
                return Result.error("权限不足");
            }
            //校验大区与省份关系是否匹配
            boolean checkRPResult = regionProvinceApplService.checkRegionProvince(chatbotAccount.getServiceRegionId(), chatbotAccount.getProvince());
            if (!checkRPResult) {
                return Result.error("大区与省份不匹配");
            }
            chatbotAccountService.saveChatbotAccount(chatbotAccount);
            return Result.OK();
        } catch (Exception e) {
            log.error("/chatbot/save 接口异常：{}", e);
            return Result.error("保存chatbot信息失败：" + e.getMessage());
        }
    }

    @ApiOperation(value = "复制chatbot账号", notes = "复制chatbot账号")
    @PostMapping("/copy")
    public Result copy(@RequestBody @Valid ChatbotAccountCopyVO chatbotAccountCopyVO) {
        try {
            //校验权限，管理员不具备复制权限
            if (PermissionCheck.isAdmin()) {
                return Result.error("权限不足");
            }
            //校验大区与省份关系是否匹配
            boolean checkRPResult = regionProvinceApplService.checkRegionProvince(chatbotAccountCopyVO.getServiceRegionId(), chatbotAccountCopyVO.getProvince());
            if (!checkRPResult) {
                return Result.error("大区与省份不匹配");
            }
            chatbotAccountService.copyChatbotAccount(chatbotAccountCopyVO);
            return Result.OK();
        } catch (Exception e) {
            log.error("/chatbot/copy 接口异常：{}", e);
            return Result.error("复制chatbot信息失败");
        }
    }

    @ApiOperation(value = "查询chatbot账号信息", notes = "查询chatbot账号信息")
    @GetMapping("/get")
    public Result get(@RequestParam String chatbotId) {
        try {
            return Result.OK(chatbotAccountService.getOne(new LambdaQueryWrapper<>(ChatbotAccount.class).eq(ChatbotAccount::getChatbotId, chatbotId)));
        } catch (Exception e) {
            log.error("/chatbot/get 接口异常：{}", e);
            return Result.error("查询chatbot信息失败");
        }
    }

    @ApiOperation(value = "更新chatbot账号信息", notes = "更新chatbot账号信息")
    @PostMapping("/update")
    public Result update(@RequestBody @Valid ChatbotAccount chatbotAccount) {
        try {
            if (StringUtils.isEmpty(chatbotAccount.getChatbotId())) {
                return Result.error("参数错误");
            }
            //校验大区与省份关系是否匹配
            boolean checkRPResult = regionProvinceApplService.checkRegionProvince(chatbotAccount.getServiceRegionId(), chatbotAccount.getProvince());
            if (!checkRPResult) {
                return Result.error("大区与省份不匹配");
            }
            chatbotAccountService.updateChatbotAccount(chatbotAccount);
            return Result.OK();
        } catch (Exception e) {
            log.error("/chatbot/update 接口异常：{}", e);
            return Result.error("更新chatbot信息失败");
        }
    }

    @ApiOperation(value = "列表查询", notes = "查询分页列表信息")
    @GetMapping("/list")
    public Result list(ChatbotAccountVO chatbotAccountVO, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        try {
            Page page = new Page(pageNo, pageSize);
            return Result.OK(chatbotAccountService.pageList(chatbotAccountVO, page));
        } catch (Exception e) {
            log.error("/chatbot/list 接口异常：{}", e);
            return Result.error("查询chatbot账号信息列表失败");
        }
    }

    @ApiOperation(value = "未被通道关联的账号列表", notes = "查询所有未被通道关联的账号列表")
    @GetMapping("/listUnlinkChannel")
    public Result listChatbotUnlinkChannel() {
        try {
            return Result.OK(chatbotAccountService.listUnlinkChannel());
        } catch (Exception e) {
            log.error("/chatbot/list 接口异常：{}", e);
            return Result.error("查询chatbot账号信息列表失败");
        }
    }

    @ApiOperation(value = "启用/停用chatbot账号", notes = "启用/停用chatbot账号")
    @PostMapping("/updateStatus")
    public Result updateStatus(@RequestBody ChatbotAccount chatbotAccount) {
        try {
            boolean paramCheck = StringUtils.isEmpty(chatbotAccount.getChatbotId())
                    || StringUtils.isEmpty(chatbotAccount.getStatus())
                    || (!chatbotAccount.getStatus().equals(StatusConstant.STATUS_ENABLED) && !chatbotAccount.getStatus().equals(StatusConstant.STATUS_DISABLED));
            if (paramCheck) {
                return Result.error("参数错误");
            }
            chatbotAccountService.updateStatus(chatbotAccount.getChatbotId(), chatbotAccount.getStatus());

            return Result.OK();
        } catch (Exception e) {
            log.error("/chatbot/updateStatus 接口异常：{}", e);
            return Result.error("启用/停用chatbot账号失败");
        }
    }


}

