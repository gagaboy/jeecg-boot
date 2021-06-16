package com.chinaunicom.business.entinfo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chinaunicom.business.entinfo.entity.EntInfo;
import com.chinaunicom.business.entinfo.vo.EntInfoVO;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 企业客户信息表 Mapper 接口
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
public interface EntInfoMapper extends BaseMapper<EntInfo> {

    /**
     * 分页列表查询
     *
     * @param page
     * @param entInfo
     * @return
     */
    IPage<EntInfoVO> pageList(Page page, @Param("entInfo") EntInfo entInfo);
}
