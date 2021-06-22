package com.chinaunicom.business.serviceregion.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chinaunicom.business.serviceregion.entity.ServiceRegion;
import com.chinaunicom.business.serviceregion.vo.ServiceRegionVO;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 运营商大区表 Mapper 接口
 * </p>
 *
 * @author 木头人
 * @since 2021-06-21
 */
public interface ServiceRegionMapper extends BaseMapper<ServiceRegion> {

    /**
     * 分页列表查询
     *
     * @param page
     * @param serviceRegionVO
     * @return
     */
    IPage<ServiceRegionVO> pageList(Page page, @Param("srv") ServiceRegionVO serviceRegionVO);
}
