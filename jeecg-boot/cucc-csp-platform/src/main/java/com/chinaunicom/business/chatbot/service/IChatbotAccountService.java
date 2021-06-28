package com.chinaunicom.business.chatbot.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chinaunicom.business.chatbot.entity.ChatbotAccount;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountCopyVO;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountSimpleVO;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountVO;

import java.util.List;

/**
 * <p>
 * chatbot账号信息 服务类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
public interface IChatbotAccountService extends IService<ChatbotAccount> {

    /**
     * 保存chatbot账号信息
     *
     * @param chatbotAccount
     */
    void saveChatbotAccount(ChatbotAccount chatbotAccount);

    /**
     * 更新chatbot账号信息
     *
     * @param chatbotAccount
     */
    void updateChatbotAccount(ChatbotAccount chatbotAccount);

    /**
     * 分页列表查询
     *
     * @param chatbotAccountVO
     * @param page
     * @return
     */
    IPage<ChatbotAccountVO> pageList(ChatbotAccountVO chatbotAccountVO, Page page);

    /**
     * 启用/停用chatbot账号
     *
     * @param chatbotId
     * @param status
     */
    void updateStatus(String chatbotId, int status);

    /**
     * 查询所有未被通道关联的chatbot账号
     *
     * @return
     */
    List<ChatbotAccountSimpleVO> listUnlinkChannel();

    /**
     * chatbot账号复制
     *
     * @param chatbotAccountCopyVO
     */
    void copyChatbotAccount(ChatbotAccountCopyVO chatbotAccountCopyVO);
}
