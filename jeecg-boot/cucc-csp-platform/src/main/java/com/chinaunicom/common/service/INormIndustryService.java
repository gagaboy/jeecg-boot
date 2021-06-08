package com.chinaunicom.common.service;

import cn.hutool.core.lang.tree.Tree;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chinaunicom.common.entity.NormIndustry;

import java.util.List;

/**
 * <p>
 * 标准行业表(GB/T 4754-2017) 服务类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-08
 */
public interface INormIndustryService extends IService<NormIndustry> {

    /**
     * 获取行业分类信息
     *
     * @return
     */
    List<Tree<String>> listIndustryCascade();
}
