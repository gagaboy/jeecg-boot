package com.chinaunicom.business.entinfo.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chinaunicom.business.entinfo.entity.EntInfo;
import com.chinaunicom.business.entinfo.vo.EntInfoDetailVO;
import com.chinaunicom.business.entinfo.vo.EntInfoVO;

/**
 * <p>
 * 企业客户信息表 服务类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
public interface IEntInfoService extends IService<EntInfo> {

    /**
     * 查询企业详细信息
     *
     * @param entId
     * @return
     */
    EntInfoDetailVO getEntInfo(String entId);

    /**
     * 企业状态变更
     *
     * @param entInfo
     */
    void updateStatus(EntInfo entInfo);

    /**
     * 分页列表查询
     *
     * @param entInfo
     * @param page
     * @return
     */
    IPage<EntInfoVO> pageList(EntInfo entInfo, Page page);

    /**
     * 新增企业信息
     *
     * @param entInfoDetail
     */
    void saveEntInfo(EntInfoDetailVO entInfoDetail);

    /**
     * 更新企业信息
     *
     * @param entInfoDetail
     */
    void updateEntInfo(EntInfoDetailVO entInfoDetail);
}
