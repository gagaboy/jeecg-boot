package com.chinaunicom.common.service.impl;

import cn.hutool.core.lang.tree.Tree;
import cn.hutool.core.lang.tree.TreeNode;
import cn.hutool.core.lang.tree.TreeUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.common.entity.NormIndustry;
import com.chinaunicom.common.mapper.NormIndustryMapper;
import com.chinaunicom.common.service.INormIndustryService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 标准行业表(GB/T 4754-2017) 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-08
 */
@Service
public class NormIndustryServiceImpl extends ServiceImpl<NormIndustryMapper, NormIndustry> implements INormIndustryService {

    @Override
    public List<Tree<String>> listIndustryCascade() {
        List<NormIndustry> industryList = this.list();
        List<TreeNode<String>> treeNodeList = new ArrayList<>(industryList.size());
        industryList.forEach(industry -> {
            TreeNode<String> treeNode = new TreeNode();
            treeNode.setId(industry.getCode());
            treeNode.setName(industry.getName());
            treeNode.setParentId(industry.getParentCode());
            treeNodeList.add(treeNode);
        });

        return TreeUtil.build(treeNodeList, "0");
    }
}
