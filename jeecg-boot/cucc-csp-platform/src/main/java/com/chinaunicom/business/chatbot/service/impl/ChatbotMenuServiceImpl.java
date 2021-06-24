package com.chinaunicom.business.chatbot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.business.chatbot.entity.ChatbotMenu;
import com.chinaunicom.business.chatbot.mapper.ChatbotMenuMapper;
import com.chinaunicom.business.chatbot.service.IChatbotMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 * <p>
 * chatbot固定菜单 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-23
 */
@Service
public class ChatbotMenuServiceImpl extends ServiceImpl<ChatbotMenuMapper, ChatbotMenu> implements IChatbotMenuService {

    @Autowired
    private ChatbotMenuMapper chatbotMenuMapper;

    @Override
    public void saveMenu(ChatbotMenu chatbotMenu) {
        //校验账号固定菜单是否已存在
        int count = chatbotMenuMapper.selectCount(new LambdaQueryWrapper<>(ChatbotMenu.class).eq(ChatbotMenu::getChatbotId, chatbotMenu.getChatbotId()));
        Assert.isTrue(count <= 0, "账号[" + chatbotMenu.getChatbotId() + "]固定菜单已存在");
        int insertCount = chatbotMenuMapper.insert(chatbotMenu);
        Assert.isTrue(insertCount > 0, "保存菜单信息失败");
    }
}
