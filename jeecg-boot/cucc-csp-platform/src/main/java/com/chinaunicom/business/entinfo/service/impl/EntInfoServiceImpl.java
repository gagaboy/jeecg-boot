package com.chinaunicom.business.entinfo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinaunicom.business.entinfo.entity.*;
import com.chinaunicom.business.entinfo.mapper.EntInfoMapper;
import com.chinaunicom.business.entinfo.service.*;
import com.chinaunicom.business.entinfo.vo.EntContractsVO;
import com.chinaunicom.business.entinfo.vo.EntInfoDetailVO;
import com.chinaunicom.business.entinfo.vo.EntInfoVO;
import com.chinaunicom.business.entinfo.vo.EntPersonVO;
import com.chinaunicom.common.entity.NormIndustry;
import com.chinaunicom.common.entity.SysArea;
import com.chinaunicom.common.service.INormIndustryService;
import com.chinaunicom.common.service.ISysAreaService;
import com.chinaunicom.constants.StatusConstant;
import com.chinaunicom.utils.StringUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * <p>
 * 企业客户信息表 服务实现类
 * </p>
 *
 * @author 木头人
 * @since 2021-06-02
 */
@Service
public class EntInfoServiceImpl extends ServiceImpl<EntInfoMapper, EntInfo> implements IEntInfoService {

    @Autowired
    private EntInfoMapper entInfoMapper;

    @Autowired
    private IEntPersonService entPersonService;

    @Autowired
    private IEntContractsService entContractsService;

    @Autowired
    private IEntAttachmentsService entAttachmentsService;

    @Autowired
    private ISysAreaService sysAreaService;

    @Autowired
    private INormIndustryService normIndustryService;

    @Autowired
    private IEntCertificationService entCertificationService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveEntInfo(EntInfoDetailVO entInfoDetail) {
        //校验企业编码是否唯一
        int count = entInfoMapper.selectCount(new LambdaQueryWrapper<>(EntInfo.class).eq(EntInfo::getEntCode, entInfoDetail.getEntInfo().getEntCode()));
        Assert.isTrue(count <= 0, "企业编码已存在");
        //保存企业报备文件信息
        List<EntAttachments> entAttachmentsList = new ArrayList<>();
        //保存企业主表信息
        EntInfoVO entInfoVO = entInfoDetail.getEntInfo();
        EntInfo entInfo = new EntInfo();
        BeanUtils.copyProperties(entInfoVO, entInfo);
        entInfo.setStatus(StatusConstant.STATUS_ENABLED);
        entInfo.setAppId(UUID.randomUUID().toString());
        entInfo.setAppSecret(UUID.randomUUID().toString());
        entInfo.setRegistTime(new Date());
        entInfo.setCertStatus(0);
        int num = entInfoMapper.insert(entInfo);
        Assert.isTrue(num > 0, "保存企业信息失败");
        if (!StringUtils.isEmpty(entInfoVO.getLogoUrl())) {
            EntAttachments entAttachments =
                    assembleAttachments(entInfo.getId(), EntAttachments.AttachmentFileType.ENT_LOGO, entInfo.getId(),
                            entInfoVO.getLogoUrl(), null, StatusConstant.STATUS_ENABLED);
            entAttachmentsList.add(entAttachments);
        }
        if (!StringUtils.isEmpty(entInfoVO.getBizLicUrl())) {
            EntAttachments entAttachments =
                    assembleAttachments(entInfo.getId(), EntAttachments.AttachmentFileType.ENT_BIZ_LIC,
                            entInfo.getId(), entInfoVO.getBizLicUrl(), null, StatusConstant.STATUS_ENABLED);
            entAttachmentsList.add(entAttachments);
        }

        //保存干系人信息
        List<EntPersonVO> personVOList = entInfoDetail.getEntPersonList();
        if (!CollectionUtils.isEmpty(personVOList)) {
            personVOList.forEach(person -> {
                EntPerson entPerson = new EntPerson();
                BeanUtils.copyProperties(person, entPerson);
                entPerson.setFromTime(new Date());
                entPerson.setEntId(entInfo.getId());
                boolean saveResult = entPersonService.save(entPerson);
                Assert.isTrue(saveResult, "保存干系人信息出错");
                if (!StringUtils.isEmpty(person.getIdCardFrontUrl())) {
                    EntAttachments entAttachments =
                            assembleAttachments(entInfo.getId(), EntAttachments.AttachmentFileType.ID_CARD_FRONT,
                                    entPerson.getId(), person.getIdCardFrontUrl(), null, StatusConstant.STATUS_ENABLED);
                    entAttachmentsList.add(entAttachments);
                }
                if (!StringUtils.isEmpty(person.getIdCardBackUrl())) {
                    EntAttachments entAttachments =
                            assembleAttachments(entInfo.getId(), EntAttachments.AttachmentFileType.ID_CARD_BACK,
                                    entPerson.getId(), person.getIdCardBackUrl(), null, StatusConstant.STATUS_ENABLED);
                    entAttachmentsList.add(entAttachments);
                }
            });
        }

        //保存合同信息
        List<EntContractsVO> contractsVOList = entInfoDetail.getEntContractsList();
        if (!CollectionUtils.isEmpty(contractsVOList)) {
            contractsVOList.forEach(contracts -> {
                EntContracts entContracts = new EntContracts();
                BeanUtils.copyProperties(contracts, entContracts);
                entContracts.setEntId(entInfo.getId());
                entContracts.setStatus(StatusConstant.STATUS_ENABLED);
                boolean saveResult = entContractsService.save(entContracts);
                Assert.isTrue(saveResult, "保存合同信息出错");
                List<String> contractsUrlList = contracts.getContractsUrlList();
                if (!CollectionUtils.isEmpty(contractsUrlList)) {
                    contractsUrlList.forEach(contractsUrl -> {
                        if (!StringUtils.isEmpty(contractsUrl)) {
                            EntAttachments entAttachments =
                                    assembleAttachments(entInfo.getId(), EntAttachments.AttachmentFileType.CONTRACT_FILE,
                                            entContracts.getId(), contractsUrl, null, StatusConstant.STATUS_ENABLED);
                            entAttachmentsList.add(entAttachments);
                        }
                    });
                }
            });
        }

        //批量保存企业报备文件信息
        entAttachmentsService.saveBatch(entAttachmentsList);
        //保存企业三网认证信息
        entCertificationService.saveEntCertificationBatch(entInfo.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void updateEntInfo(EntInfoDetailVO entInfoDetail) {
        //主体信息变更
        EntInfoVO entInfoVO = entInfoDetail.getEntInfo();
        EntInfo oldEntInfo = entInfoMapper.selectById(entInfoVO.getId());
        Assert.notNull(oldEntInfo, "企业不存在");
        //校验企业编码是否唯一
        int count = entInfoMapper.selectCount(new LambdaQueryWrapper<>(EntInfo.class).eq(EntInfo::getEntCode, entInfoVO.getEntCode()).ne(EntInfo::getId, entInfoVO.getId()));
        Assert.isTrue(count <= 0, "企业编码已存在");
        BeanUtils.copyProperties(entInfoVO, oldEntInfo);
        int num = entInfoMapper.updateById(oldEntInfo);
        Assert.isTrue(num > 0, "更新企业信息失败");

        //新插入企业报备文件（logo，执照，身份证正反面，合同等信息）
        List<EntAttachments> newAttachmentsList = new ArrayList<>(4);

        Map<String, List<EntAttachments>> attachmentsMap = getEntAttachmentInfo(entInfoVO.getId());

        updateEntInfo(entInfoVO, newAttachmentsList, attachmentsMap);

        updateEntPerson(entInfoDetail, entInfoVO, newAttachmentsList, attachmentsMap);

        //判断合同信息是否变更
        updateEntContracts(entInfoDetail, entInfoVO, newAttachmentsList);

        if (newAttachmentsList.size() > 0) {
            boolean result = entAttachmentsService.saveBatch(newAttachmentsList);
            Assert.isTrue(result, "更新企业信息失败");
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateEntContracts(EntInfoDetailVO entInfoDetail, EntInfoVO entInfoVO, List<EntAttachments> newAttachmentsList) {
        EntContractsVO contractsVO = entInfoDetail.getEntContractsList().get(0);
        EntContracts contracts = entContractsService.lambdaQuery().eq(EntContracts::getEntId, entInfoVO.getId()).eq(EntContracts::getStatus, StatusConstant.STATUS_ENABLED).one();

        //合同编号相同则视为未变更
        if (contractsVO.getContractCode().equals(contracts.getContractCode())) {
            BeanUtils.copyProperties(contractsVO, contracts, new String[]{"id", "entId"});
            boolean result = entContractsService.updateById(contracts);
            Assert.isTrue(result, "更新合同信息失败");
            //查询出已上传的合同附件
            List<EntAttachments> attachmentsList = entAttachmentsService.lambdaQuery()
                    .eq(EntAttachments::getFileType, EntAttachments.AttachmentFileType.CONTRACT_FILE)
                    .eq(EntAttachments::getSourceId, contracts.getId())
                    .eq(EntAttachments::getStatus, StatusConstant.STATUS_ENABLED).list();
            List<String> oldContractAttachmentList = attachmentsList.stream().map(EntAttachments::getLocalUrl).collect(Collectors.toList());
            List<String> tempContractAttachmentList = new ArrayList<>(oldContractAttachmentList);
            List<String> newContractAttachmentList = contractsVO.getContractsUrlList();
            //将已删除附件设置为失效状态
            oldContractAttachmentList.removeAll(newContractAttachmentList);
            if (oldContractAttachmentList.size() > 0) {
                boolean updateResult = entAttachmentsService.lambdaUpdate().set(EntAttachments::getStatus, StatusConstant.STATUS_DISABLED)
                        .eq(EntAttachments::getFileType, EntAttachments.AttachmentFileType.CONTRACT_FILE)
                        .eq(EntAttachments::getSourceId, contracts.getId())
                        .in(EntAttachments::getLocalUrl, oldContractAttachmentList).update();
                Assert.isTrue(updateResult, "更新合同附件失败");
            }
            //保存新增的附件
            newContractAttachmentList.removeAll(tempContractAttachmentList);
            if (newContractAttachmentList.size() > 0) {
                newContractAttachmentList.forEach(contractsUrl -> {
                    if (!StringUtils.isEmpty(contractsUrl)) {
                        EntAttachments entAttachments = assembleAttachments(entInfoVO.getId(), EntAttachments.AttachmentFileType.CONTRACT_FILE,
                                contracts.getId(), contractsUrl, null, StatusConstant.STATUS_ENABLED);
                        newAttachmentsList.add(entAttachments);
                    }
                });
            }
        } else {
            //将旧合同设置为失效状态
            contracts.setStatus(StatusConstant.STATUS_DISABLED);
            boolean result = entContractsService.updateById(contracts);
            Assert.isTrue(result, "更新合同信息失败");
            //新增合同
            EntContracts entContracts = new EntContracts();
            BeanUtils.copyProperties(contractsVO, entContracts);
            entContracts.setEntId(entInfoVO.getId());
            entContracts.setStatus(StatusConstant.STATUS_ENABLED);
            boolean saveResult = entContractsService.save(entContracts);
            Assert.isTrue(saveResult, "保存合同信息出错");
            //将原合同附件全部设置为失效状态，新增附件
            boolean updateResult = entAttachmentsService.lambdaUpdate()
                    .set(EntAttachments::getStatus, StatusConstant.STATUS_DISABLED)
                    .eq(EntAttachments::getFileType, EntAttachments.AttachmentFileType.CONTRACT_FILE)
                    .eq(EntAttachments::getSourceId, contracts.getId()).update();
            Assert.isTrue(updateResult, "更新合同附件失败");
            contractsVO.getContractsUrlList().forEach(contractsUrl -> {
                if (!StringUtils.isEmpty(contractsUrl)) {
                    EntAttachments entAttachments = assembleAttachments(entInfoVO.getId(), EntAttachments.AttachmentFileType.CONTRACT_FILE,
                            entContracts.getId(), contractsUrl, null, StatusConstant.STATUS_ENABLED);
                    newAttachmentsList.add(entAttachments);
                }
            });
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateEntPerson(EntInfoDetailVO entInfoDetail, EntInfoVO entInfoVO, List<EntAttachments> newAttachmentsList, Map<String, List<EntAttachments>> attachmentsMap) {
        List<EntPersonVO> entPersonVOList = entInfoDetail.getEntPersonList();
        //判断企业干系人是否变更
        List<EntPerson> personList = entPersonService.lambdaQuery().eq(EntPerson::getEntId, entInfoVO.getId()).isNull(EntPerson::getThruTime).list();
        personList.forEach(person -> {
            entPersonVOList.forEach(entPersonVO -> {
                if (person.getPersonType().equals(entPersonVO.getPersonType())) {
                    boolean newIdCardFront = false;
                    boolean newIdCardBack = false;
                    String personId;
                    //身份证号相同则视为未变更
                    if (person.getIdCard().equals(entPersonVO.getIdCard())) {
                        BeanUtils.copyProperties(entPersonVO, person, new String[]{"id", "entId"});
                        boolean result = entPersonService.updateById(person);
                        Assert.isTrue(result, "更新企业联系人或法人信息失败");
                        //判断干系人身份证照片是否变更
                        EntAttachments idCardFrontAttachments = attachmentsMap.get(EntAttachments.AttachmentFileType.ID_CARD_FRONT + ":" + person.getId()).get(0);
                        if (!idCardFrontAttachments.getLocalUrl().equals(entPersonVO.getIdCardFrontUrl())) {
                            idCardFrontAttachments.setStatus(StatusConstant.STATUS_DISABLED);
                            boolean result1 = entAttachmentsService.updateById(idCardFrontAttachments);
                            Assert.isTrue(result1, "更新企业联系人或法人身份证信息失败");

                            newIdCardFront = true;
                        }
                        EntAttachments idCardBackAttachments = attachmentsMap.get(EntAttachments.AttachmentFileType.ID_CARD_BACK + ":" + person.getId()).get(0);
                        if (!idCardBackAttachments.getLocalUrl().equals(entPersonVO.getIdCardBackUrl())) {
                            idCardBackAttachments.setStatus(StatusConstant.STATUS_DISABLED);
                            boolean result2 = entAttachmentsService.updateById(idCardBackAttachments);
                            Assert.isTrue(result2, "更新企业联系人或法人身份证信息失败");
                            newIdCardBack = true;
                        }
                        personId = person.getId();
                    } else {
                        newIdCardFront = true;
                        newIdCardBack = true;

                        person.setThruTime(new Date());
                        boolean result = entPersonService.updateById(person);
                        Assert.isTrue(result, "更新企业联系人或法人信息失败");
                        EntPerson entPerson = new EntPerson();
                        BeanUtils.copyProperties(entPersonVO, entPerson);
                        entPerson.setFromTime(new Date());
                        entPerson.setEntId(entInfoVO.getId());
                        boolean saveResult = entPersonService.save(entPerson);
                        Assert.isTrue(saveResult, "保存干系人信息出错");
                        personId = entPerson.getId();
                    }

                    if (newIdCardFront) {
                        EntAttachments idCardFrontAttachments = assembleAttachments(entInfoVO.getId(), EntAttachments.AttachmentFileType.ID_CARD_FRONT,
                                personId, entPersonVO.getIdCardFrontUrl(), null, StatusConstant.STATUS_ENABLED);
                        newAttachmentsList.add(idCardFrontAttachments);
                    }
                    if (newIdCardBack) {
                        EntAttachments idCardBackAttachments = assembleAttachments(entInfoVO.getId(), EntAttachments.AttachmentFileType.ID_CARD_BACK,
                                personId, entPersonVO.getIdCardBackUrl(), null, StatusConstant.STATUS_ENABLED);
                        newAttachmentsList.add(idCardBackAttachments);
                    }
                }
            });
        });
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateEntInfo(EntInfoVO entInfoVO, List<EntAttachments> newAttachmentsList, Map<String, List<EntAttachments>> attachmentsMap) {
        //判断企业logo及营业执照是否变更
        EntAttachments logoAttachments = attachmentsMap.get(EntAttachments.AttachmentFileType.ENT_LOGO + ":" + entInfoVO.getId()).get(0);
        if (!entInfoVO.getLogoUrl().equals(logoAttachments.getLocalUrl())) {
            //logo已变更
            logoAttachments.setStatus(StatusConstant.STATUS_DISABLED);
            boolean result = entAttachmentsService.updateById(logoAttachments);
            Assert.isTrue(result, "更新企业LOGO失败");

            EntAttachments entAttachments = assembleAttachments(entInfoVO.getId(), EntAttachments.AttachmentFileType.ENT_LOGO, entInfoVO.getId(),
                    entInfoVO.getLogoUrl(), null, StatusConstant.STATUS_ENABLED);
            newAttachmentsList.add(entAttachments);
        }
        EntAttachments bizLicAttachments = attachmentsMap.get(EntAttachments.AttachmentFileType.ENT_BIZ_LIC + ":" + entInfoVO.getId()).get(0);
        if (!entInfoVO.getBizLicUrl().equals(bizLicAttachments.getLocalUrl())) {
            //营业执照已变更
            bizLicAttachments.setStatus(StatusConstant.STATUS_DISABLED);
            boolean result = entAttachmentsService.updateById(bizLicAttachments);
            Assert.isTrue(result, "更新企业营业执照信息失败");

            EntAttachments entAttachments = assembleAttachments(entInfoVO.getId(), EntAttachments.AttachmentFileType.ENT_BIZ_LIC, entInfoVO.getId(),
                    entInfoVO.getBizLicUrl(), null, StatusConstant.STATUS_ENABLED);
            newAttachmentsList.add(entAttachments);
        }
    }

    @Override
    public void updateStatus(EntInfo entInfo) {
        EntInfo existEntInfo = entInfoMapper.selectById(entInfo.getId());
        Assert.notNull(existEntInfo, "企业不存在");
        existEntInfo.setStatus(entInfo.getStatus());
        entInfoMapper.updateById(existEntInfo);
    }

    @Override
    public IPage<EntInfoVO> pageList(EntInfo entInfo, Page page) {
        return entInfoMapper.pageList(page, entInfo);
    }

    @Override
    public EntInfoDetailVO getEntInfo(String entId) {
        EntInfoDetailVO entInfoDetailVO = new EntInfoDetailVO();

        //获取企业基本信息
        EntInfo entInfo = entInfoMapper.selectById(entId);
        Assert.notNull(entInfo, "企业信息不存在");

        Map<String, List<EntAttachments>> attachmentsMap = getEntAttachmentInfo(entId);

        EntInfoVO entInfoVO = assembleEntInfo(entInfo, attachmentsMap);
        entInfoDetailVO.setEntInfo(entInfoVO);

        List<EntPerson> personList = entPersonService.lambdaQuery().eq(EntPerson::getEntId, entId).isNull(EntPerson::getThruTime).list();
        if (!CollectionUtils.isEmpty(personList)) {
            List<EntPersonVO> personVOList = assemblePersonInfo(attachmentsMap, personList);
            entInfoDetailVO.setEntPersonList(personVOList);
        }

        List<EntContracts> contractsList = entContractsService.lambdaQuery().eq(EntContracts::getEntId, entId).eq(EntContracts::getStatus, StatusConstant.STATUS_ENABLED).list();
        if (!CollectionUtils.isEmpty(contractsList)) {
            List<EntContractsVO> contractsVOList = assembleContractsInfo(attachmentsMap, contractsList);
            entInfoDetailVO.setEntContractsList(contractsVOList);
        }

        return entInfoDetailVO;
    }

    /**
     * 组装企业主体信息
     *
     * @param entInfo
     * @param attachmentsMap
     * @return
     */
    private EntInfoVO assembleEntInfo(EntInfo entInfo, Map<String, List<EntAttachments>> attachmentsMap) {
        EntInfoVO entInfoVO = new EntInfoVO();
        BeanUtils.copyProperties(entInfo, entInfoVO);
        List<EntAttachments> bizLicAttachments = attachmentsMap.get(EntAttachments.AttachmentFileType.ENT_BIZ_LIC + ":" + entInfo.getId());
        if (!CollectionUtils.isEmpty(bizLicAttachments)) {
            entInfoVO.setBizLicUrl(bizLicAttachments.get(0).getLocalUrl());
        }
        List<EntAttachments> logoAttachments = attachmentsMap.get(EntAttachments.AttachmentFileType.ENT_LOGO + ":" + entInfo.getId());
        if (!CollectionUtils.isEmpty(logoAttachments)) {
            entInfoVO.setLogoUrl(logoAttachments.get(0).getLocalUrl());
        }
        SysArea province = sysAreaService.lambdaQuery().eq(SysArea::getId, entInfo.getProvince()).one();
        if (province != null) {
            entInfoVO.setProvinceName(province.getName());
        }
        SysArea city = sysAreaService.lambdaQuery().eq(SysArea::getId, entInfo.getCity()).one();
        if (city != null) {
            entInfoVO.setCityName(city.getName());
        }
        NormIndustry normIndustry = normIndustryService.lambdaQuery().eq(NormIndustry::getCode, entInfo.getIndustry()).one();
        if (normIndustry != null) {
            entInfoVO.setIndustryName(normIndustry.getName());
        }
        List<EntCertification> certificationList = entCertificationService.lambdaQuery().eq(EntCertification::getEntId, entInfo.getId()).list();
        if (!CollectionUtils.isEmpty(certificationList)) {
            entInfoVO.setEntCertificationList(certificationList);
        }

        return entInfoVO;
    }

    /**
     * 获取企业报备文件信息
     *
     * @param entId
     * @return
     */
    private Map<String, List<EntAttachments>> getEntAttachmentInfo(String entId) {
        Map<String, List<EntAttachments>> attachmentsMap = new HashMap<>(4);
        //获取企业报备文件信息
        List<EntAttachments> attachmentsList = entAttachmentsService.lambdaQuery().eq(EntAttachments::getEntId, entId).eq(EntAttachments::getStatus, StatusConstant.STATUS_ENABLED).list();
        attachmentsList.forEach(entAttachments -> {
            String key = entAttachments.getFileType() + ":" + entAttachments.getSourceId();
            if (attachmentsMap.get(key) != null) {
                List<EntAttachments> attachments = attachmentsMap.get(key);
                attachments.add(entAttachments);
            } else {
                List<EntAttachments> attachments = new ArrayList<>(2);
                attachments.add(entAttachments);
                attachmentsMap.put(entAttachments.getFileType() + ":" + entAttachments.getSourceId(), attachments);
            }
        });
        return attachmentsMap;
    }

    /**
     * 组装企业合同信息
     *
     * @param attachmentsMap
     * @param contractsList
     * @return
     */
    private List<EntContractsVO> assembleContractsInfo(Map<String, List<EntAttachments>> attachmentsMap, List<EntContracts> contractsList) {
        List<EntContractsVO> contractsVOList = new ArrayList<>(4);
        contractsList.forEach(entContracts -> {
            EntContractsVO entContractsVO = new EntContractsVO();
            BeanUtils.copyProperties(entContracts, entContractsVO);
            List<EntAttachments> attachments = attachmentsMap.get(EntAttachments.AttachmentFileType.CONTRACT_FILE + ":" + entContracts.getId());
            if (!CollectionUtils.isEmpty(attachments)) {
                entContractsVO.setContractsUrlList(attachments.stream().map(EntAttachments::getLocalUrl).collect(Collectors.toList()));
            }
            contractsVOList.add(entContractsVO);
        });
        return contractsVOList;
    }

    /**
     * 组装企业干系人信息（法人、联系人...）
     *
     * @param attachmentsMap
     * @param personList
     * @return
     */
    private List<EntPersonVO> assemblePersonInfo(Map<String, List<EntAttachments>> attachmentsMap, List<EntPerson> personList) {
        List<EntPersonVO> personVOList = new ArrayList<>(4);
        personList.forEach(entPerson -> {
            EntPersonVO entPersonVO = new EntPersonVO();
            BeanUtils.copyProperties(entPerson, entPersonVO);
            List<EntAttachments> idCardFrontAttachments = attachmentsMap.get(EntAttachments.AttachmentFileType.ID_CARD_FRONT + ":" + entPerson.getId());
            if (!CollectionUtils.isEmpty(idCardFrontAttachments)) {
                entPersonVO.setIdCardFrontUrl(idCardFrontAttachments.get(0).getLocalUrl());
            }
            List<EntAttachments> idCardBackAttachments = attachmentsMap.get(EntAttachments.AttachmentFileType.ID_CARD_BACK + ":" + entPerson.getId());
            if (!CollectionUtils.isEmpty(idCardBackAttachments)) {
                entPersonVO.setIdCardBackUrl(idCardBackAttachments.get(0).getLocalUrl());
            }
            personVOList.add(entPersonVO);
        });
        return personVOList;
    }

    /**
     * 组装EntAttachments对象
     *
     * @param entId
     * @param fileType
     * @param sourceId
     * @param localUrl
     * @param operatorUrl
     * @param status
     * @return
     */
    private EntAttachments assembleAttachments(String entId, String fileType, String sourceId, String localUrl, String operatorUrl, Integer status) {
        EntAttachments entAttachments = new EntAttachments();
        entAttachments.setEntId(entId);
        entAttachments.setNonce(StringUtil.generateNonce(8));
        entAttachments.setFileType(fileType);
        entAttachments.setSourceId(sourceId);
        entAttachments.setLocalUrl(localUrl);
        entAttachments.setOperatorUrl(operatorUrl);
        entAttachments.setStatus(status);

        return entAttachments;
    }

}
