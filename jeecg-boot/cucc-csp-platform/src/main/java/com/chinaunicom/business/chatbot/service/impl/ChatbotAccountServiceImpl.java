package com.chinaunicom.business.chatbot.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.business.chatbot.entity.ChatbotAccount;
import com.chinaunicom.business.chatbot.mapper.ChatbotAccountMapper;
import com.chinaunicom.business.chatbot.service.IChatbotAccountService;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountVO;
import com.chinaunicom.common.service.IRegionProvinceApplService;
import com.chinaunicom.constants.StatusConstant;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

/**
 * <p>
 * chatbot账号信息 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
@Service
public class ChatbotAccountServiceImpl extends ServiceImpl<ChatbotAccountMapper, ChatbotAccount> implements IChatbotAccountService {

    @Autowired
    private ChatbotAccountMapper chatbotAccountMapper;

    @Override
    public void saveChatbotAccount(ChatbotAccount chatbotAccount) {
        chatbotAccount.setStatus(StatusConstant.STATUS_ENABLED);
        int insertCount = chatbotAccountMapper.insert(chatbotAccount);
        Assert.isTrue(insertCount > 0, "保存chatbot账号信息失败");
    }

    @Override
    public void updateChatbotAccount(ChatbotAccount chatbotAccount) {
        ChatbotAccount oldChatbotAccount = chatbotAccountMapper.selectById(chatbotAccount.getChatbotId());
        Assert.notNull(oldChatbotAccount, "数据不存在");
        BeanUtils.copyProperties(chatbotAccount, oldChatbotAccount);

        chatbotAccountMapper.updateById(oldChatbotAccount);
    }

    @Override
    public IPage<ChatbotAccountVO> pageList(ChatbotAccountVO chatbotAccountVO, Page page) {
        return chatbotAccountMapper.pageList(page, chatbotAccountVO);
    }

    @Override
    public void updateStatus(String chatbotId, int status) {
        ChatbotAccount chatbotAccount = chatbotAccountMapper.selectById(chatbotId);
        Assert.notNull(chatbotAccount, "数据不存在");
        chatbotAccount.setStatus(status);

        chatbotAccountMapper.updateById(chatbotAccount);
    }

    @Override
    public List<ChatbotAccount> listUnlinkChannel() {
        return chatbotAccountMapper.listUnlinkChannel();
    }
}
