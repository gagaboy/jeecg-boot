package com.chinaunicom.business.serviceregion.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chinaunicom.business.serviceregion.entity.ServiceRegion;
import com.chinaunicom.business.serviceregion.vo.ServiceRegionVO;
import com.chinaunicom.common.entity.SysArea;

import java.util.List;

/**
 * <p>
 * 运营商大区表 服务类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-21
 */
public interface IServiceRegionService extends IService<ServiceRegion> {

    /**
     * 保存服务大区信息
     *
     * @param serviceRegion
     */
    void saveServiceRegion(ServiceRegion serviceRegion);

    /**
     * 更新服务大区信息
     *
     * @param serviceRegion
     */
    void updateServiceRegion(ServiceRegion serviceRegion);

    /**
     * 分页列表查询
     *
     * @param serviceRegionVO
     * @param page
     * @return
     */
    IPage<ServiceRegionVO> pageList(ServiceRegionVO serviceRegionVO, Page page);

    /**
     * 查询指定服务大区关联的省份信息列表
     *
     * @param serviceRegionId
     * @return
     */
    List<SysArea> listProvinceByServiceRegion(String serviceRegionId);
}
