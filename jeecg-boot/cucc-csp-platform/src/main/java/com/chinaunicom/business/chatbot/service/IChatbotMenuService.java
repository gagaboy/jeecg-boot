package com.chinaunicom.business.chatbot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chinaunicom.business.chatbot.entity.ChatbotMenu;

/**
 * <p>
 * chatbot固定菜单 服务类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-23
 */
public interface IChatbotMenuService extends IService<ChatbotMenu> {

    /**
     * 保存chatbot账号固定菜单信息
     *
     * @param chatbotMenu
     */
    void saveMenu(ChatbotMenu chatbotMenu);
}
