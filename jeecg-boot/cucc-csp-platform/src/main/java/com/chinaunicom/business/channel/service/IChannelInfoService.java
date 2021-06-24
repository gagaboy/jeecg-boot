package com.chinaunicom.business.channel.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chinaunicom.business.channel.entity.ChannelInfo;
import com.chinaunicom.business.channel.vo.ChannelInfoVO;

import java.util.List;

/**
 * <p>
 * 通道信息 服务类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-23
 */
public interface IChannelInfoService extends IService<ChannelInfo> {

    /**
     * 保存通道信息
     *
     * @param channelInfoVO
     */
    void saveChannelInfo(ChannelInfoVO channelInfoVO);

    /**
     * 更新通道信息
     *
     * @param channelInfoVO
     */
    void updateChannelInfo(ChannelInfoVO channelInfoVO);

    /**
     * 通道信息分页列表查询
     *
     * @param channelInfoVO
     * @param page
     * @return
     */
    IPage<ChannelInfoVO> pageList(ChannelInfoVO channelInfoVO, Page page);

    /**
     * 删除通道信息
     *
     * @param channelId
     */
    void deleteById(String channelId);

    /**
     * 批量删除通道信息
     *
     * @param channelIdList
     */
    void deleteByBatch(List<String> channelIdList);
}
