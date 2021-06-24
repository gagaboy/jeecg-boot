package com.chinaunicom.business.channel.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chinaunicom.business.channel.entity.ChannelInfo;
import com.chinaunicom.business.channel.vo.ChannelInfoVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 通道信息 Mapper 接口
 * </p>
 *
 * @author 木头人
 * @since 2021-06-23
 */
public interface ChannelInfoMapper extends BaseMapper<ChannelInfo> {

    IPage<ChannelInfoVO> pageList(Page page, @Param("civ") ChannelInfoVO channelInfoVO);

    /**
     * 批量删除
     *
     * @param channelIdList
     */
    void deleteByBatch(@Param("ids") List<String> channelIdList);
}
