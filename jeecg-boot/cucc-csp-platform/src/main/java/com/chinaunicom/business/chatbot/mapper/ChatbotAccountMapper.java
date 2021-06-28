package com.chinaunicom.business.chatbot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chinaunicom.business.chatbot.entity.ChatbotAccount;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountSimpleVO;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * chatbot账号信息 Mapper 接口
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
public interface ChatbotAccountMapper extends BaseMapper<ChatbotAccount> {

    /**
     * 分页列表查询
     *
     * @param page
     * @param chatbotAccountVO
     * @return
     */
    IPage<ChatbotAccountVO> pageList(Page page, @Param("cav") ChatbotAccountVO chatbotAccountVO);

    /**
     * 查询所有未被通道关联的chatbot账号
     *
     * @return
     */
    List<ChatbotAccountSimpleVO> listUnlinkChannel();

    /**
     * 获取Chatbot账号信息
     *
     * @param chatbotId
     * @return
     */
    ChatbotAccountVO queryChatbotAccount(@Param("chatbotId") String chatbotId);

    /**
     * 根据chatbot名称及运营商查询chatbot数量
     *
     * @param chatbotId
     * @param chatbotName
     * @param operatorId
     * @return
     */
    int countChatbotWithOperator(@Param("chatbotId") String chatbotId, @Param("chatbotId") String chatbotName, @Param("operatorId") String operatorId);
}
