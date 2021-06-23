package com.chinaunicom.common.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chinaunicom.common.entity.RegionProvinceAppl;
import com.chinaunicom.common.entity.SysArea;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 服务大区与省份关联表 Mapper 接口
 * </p>
 *
 * @author 木头人
 * @since 2021-06-22
 */
public interface RegionProvinceApplMapper extends BaseMapper<RegionProvinceAppl> {

    /**
     * 查询大区关联省份信息
     *
     * @param regionId
     * @return
     */
    List<SysArea> getProvinceByRegionId(String regionId);
}
