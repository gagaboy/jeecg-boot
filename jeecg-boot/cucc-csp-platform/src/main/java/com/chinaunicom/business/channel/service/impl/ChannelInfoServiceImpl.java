package com.chinaunicom.business.channel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.business.channel.entity.ChannelChatbotAppl;
import com.chinaunicom.business.channel.entity.ChannelInfo;
import com.chinaunicom.business.channel.mapper.ChannelInfoMapper;
import com.chinaunicom.business.channel.service.IChannelChatbotApplService;
import com.chinaunicom.business.channel.service.IChannelInfoService;
import com.chinaunicom.business.channel.vo.ChannelInfoVO;
import com.chinaunicom.business.chatbot.vo.ChatbotAccountSimpleVO;
import com.chinaunicom.constants.StatusConstant;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 通道信息 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-23
 */
@Service
public class ChannelInfoServiceImpl extends ServiceImpl<ChannelInfoMapper, ChannelInfo> implements IChannelInfoService {

    @Autowired
    private IChannelChatbotApplService channelChatbotApplService;

    @Autowired
    private ChannelInfoMapper channelInfoMapper;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void saveChannelInfo(ChannelInfoVO channelInfoVO) {
        List<ChatbotAccountSimpleVO> accountList = channelInfoVO.getChatbotAccountList();
        accountList = accountList.stream().filter(account -> !StringUtils.isEmpty(account.getChatbotId())).collect(Collectors.toList());
        Assert.notEmpty(accountList, "未关联账号");
        //保存ChannelInfo
        ChannelInfo channelInfo = new ChannelInfo();
        BeanUtils.copyProperties(channelInfoVO, channelInfo);
        channelInfo.setStatus(StatusConstant.STATUS_ENABLED);
        int insertCount = channelInfoMapper.insert(channelInfo);
        Assert.isTrue(insertCount > 0, "保存通道信息失败");

        //保存通道关联账号信息
        List<ChannelChatbotAppl> channelChatbotApplList = new ArrayList<>(4);
        accountList.forEach(account -> {
            ChannelChatbotAppl appl = new ChannelChatbotAppl();
            appl.setChannelId(channelInfo.getChannelId());
            appl.setChatbotId(account.getChatbotId());
            channelChatbotApplList.add(appl);
        });
        boolean saveResult = channelChatbotApplService.saveBatch(channelChatbotApplList);
        Assert.isTrue(saveResult, "保存通道关联账号失败");
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void updateChannelInfo(ChannelInfoVO channelInfoVO) {
        ChannelInfo channelInfo = channelInfoMapper.selectOne(new LambdaQueryWrapper<>(ChannelInfo.class).eq(ChannelInfo::getChannelId, channelInfoVO.getChannelId()).ne(ChannelInfo::getStatus, StatusConstant.STATUS_DELETE));
        Assert.notNull(channelInfo, "通道不存在");
        //更新ChannelInfo
        BeanUtils.copyProperties(channelInfoVO, channelInfo);
        channelInfoMapper.updateById(channelInfo);

        //更新通道关联账号信息
        List<ChannelChatbotAppl> channelChatbotApplList = channelChatbotApplService.list(new LambdaQueryWrapper<>(ChannelChatbotAppl.class).eq(ChannelChatbotAppl::getChannelId, channelInfoVO.getChannelId()));
        List<String> oldApplChatbotIdList = channelChatbotApplList.stream().map(ChannelChatbotAppl::getChatbotId).collect(Collectors.toList());
        List<String> tempApplChatbotIdList = new ArrayList<>(oldApplChatbotIdList);
        List<String> newApplChatbotIdList = channelInfoVO.getChatbotAccountList().stream().map(ChatbotAccountSimpleVO::getChatbotId).collect(Collectors.toList());
        oldApplChatbotIdList.removeAll(newApplChatbotIdList);
        //需要删除的账号
        if (oldApplChatbotIdList.size() > 0) {
            channelChatbotApplService.remove(new LambdaQueryWrapper<>(ChannelChatbotAppl.class).in(ChannelChatbotAppl::getChatbotId, oldApplChatbotIdList));
        }
        //新增的账号
        newApplChatbotIdList.removeAll(tempApplChatbotIdList);
        if (newApplChatbotIdList.size() > 0) {
            List<ChannelChatbotAppl> insertChannelChatbotApplList = new ArrayList<>(newApplChatbotIdList.size());
            newApplChatbotIdList.forEach(newApplChatbotId -> {
                ChannelChatbotAppl appl = new ChannelChatbotAppl();
                appl.setChannelId(channelInfoVO.getChannelId());
                appl.setChatbotId(newApplChatbotId);
                insertChannelChatbotApplList.add(appl);
            });
            boolean saveResult = channelChatbotApplService.saveBatch(insertChannelChatbotApplList);
            Assert.isTrue(saveResult, "保存通道关联账号失败");
        }
    }

    @Override
    public IPage<ChannelInfoVO> pageList(ChannelInfoVO channelInfoVO, Page page) {
        return channelInfoMapper.pageList(page, channelInfoVO);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void deleteById(String channelId) {
        ChannelInfo channelInfo = channelInfoMapper.selectById(channelId);
        Assert.notNull(channelInfo, "数据不存在");
        //删除与通道关联，释放chatbot资源
        boolean deleteResult = channelChatbotApplService.remove(new LambdaQueryWrapper<>(ChannelChatbotAppl.class).eq(ChannelChatbotAppl::getChannelId, channelId));
        Assert.isTrue(deleteResult, "删除通道失败");
        channelInfo.setStatus(StatusConstant.STATUS_DELETE);
        int updateCount = channelInfoMapper.updateById(channelInfo);
        Assert.isTrue(updateCount > 0, "删除通道失败");
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void deleteByBatch(List<String> channelIdList) {
        //删除与通道关联，释放chatbot资源
        boolean deleteResult = channelChatbotApplService.remove(new LambdaQueryWrapper<>(ChannelChatbotAppl.class).in(ChannelChatbotAppl::getChannelId, channelIdList));
        Assert.isTrue(deleteResult, "删除通道失败");
        channelInfoMapper.deleteByBatch(channelIdList);
    }
}
