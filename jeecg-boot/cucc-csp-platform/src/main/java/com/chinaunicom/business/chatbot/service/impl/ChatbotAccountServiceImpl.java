package com.chinaunicom.business.chatbot.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.business.chatbot.entity.ChatbotAccount;
import com.chinaunicom.business.chatbot.mapper.ChatbotAccountMapper;
import com.chinaunicom.business.chatbot.service.IChatbotAccountService;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountCopyVO;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountSimpleVO;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountVO;
import com.chinaunicom.business.serviceregion.entity.ServiceRegion;
import com.chinaunicom.business.serviceregion.service.IServiceRegionService;
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

    @Autowired
    private IServiceRegionService serviceRegionService;

    @Override
    public void saveChatbotAccount(ChatbotAccount chatbotAccount) {
        //唯一性校验
        boolean unique = checkUniqueChatbotWithOperator(null, chatbotAccount.getChatbotName(), chatbotAccount.getServiceRegionId());
        Assert.isTrue(unique, "该运营商下已存在该账号名称");

        chatbotAccount.setStatus(StatusConstant.STATUS_ENABLED);
        int insertCount = chatbotAccountMapper.insert(chatbotAccount);
        Assert.isTrue(insertCount > 0, "保存chatbot账号信息失败");
    }

    @Override
    public void updateChatbotAccount(ChatbotAccount chatbotAccount) {
        //唯一性校验
        boolean unique = checkUniqueChatbotWithOperator(chatbotAccount.getChatbotId(), chatbotAccount.getChatbotName(), chatbotAccount.getServiceRegionId());
        Assert.isTrue(unique, "该运营商下已存在该账号名称");

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
    public List<ChatbotAccountSimpleVO> listUnlinkChannel() {
        return chatbotAccountMapper.listUnlinkChannel();
    }

    @Override
    public void copyChatbotAccount(ChatbotAccountCopyVO chatbotAccountCopyVO) {
        ChatbotAccount chatbotAccount = chatbotAccountMapper.selectById(chatbotAccountCopyVO.getChatbotId());
        Assert.notNull(chatbotAccount, "要复制的账号不存在");

        //唯一性校验
        boolean unique = checkUniqueChatbotWithOperator(null, chatbotAccountCopyVO.getChatbotName(), chatbotAccountCopyVO.getServiceRegionId());
        Assert.isTrue(unique, "该运营商下已存在该账号名称");

        ChatbotAccount newChatbotAccount = new ChatbotAccount();
        BeanUtils.copyProperties(chatbotAccount, newChatbotAccount);
        BeanUtils.copyProperties(chatbotAccountCopyVO, newChatbotAccount);
        newChatbotAccount.setChatbotId(null);
        newChatbotAccount.setEntId(null);
        newChatbotAccount.setCreateBy(null);
        newChatbotAccount.setCreateTime(null);
        newChatbotAccount.setUpdateBy(null);
        newChatbotAccount.setUpdateTime(null);
        newChatbotAccount.setStatus(StatusConstant.STATUS_ENABLED);
        int insertCount = chatbotAccountMapper.insert(newChatbotAccount);
        Assert.isTrue(insertCount > 0, "复制Chatbot账号失败");
    }

    /**
     * Chatbot账号名称+运营商唯一性校验
     *
     * @param serviceRegionId
     * @param chatbotId
     * @param chatbotName
     */
    private boolean checkUniqueChatbotWithOperator(String chatbotId, String chatbotName, String serviceRegionId) {
        ServiceRegion serviceRegion = serviceRegionService.getById(serviceRegionId);
        int count = chatbotAccountMapper.countChatbotWithOperator(chatbotId, chatbotName, serviceRegion.getOperatorId());
        return count > 0 ? false : true;
    }
}
