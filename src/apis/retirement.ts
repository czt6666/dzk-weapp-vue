import service from "./index";

export function getRetirementStationList(params: {
    name?: string;
    page: number;
    pageSize: number;
}) {
    return service.get("/admin/ecadmin/station/page", { params });
}

export function getRetirementStationDetail(id: number) {
    return service.get(`/admin/ecadmin/station/${id}`);
}

export interface IRetirementStation {
    /** 主键 ID */
    id: number;

    /** 机构名称 */
    name: string;

    /** 注册地址 */
    registeredAddress: string;

    /** 实际经营地址 */
    businessAddress: string;

    /** 注册地址纬度 */
    registeredLatitude: number | null;

    /** 注册地址经度 */
    registeredLongitude: number | null;

    /** 经营地址纬度 */
    businessLatitude: number | null;

    /** 经营地址经度 */
    businessLongitude: number | null;

    /** 统一社会信用代码 */
    unifiedSocialCreditCode: string;

    /** 法定代表人 */
    legalRepresentative: string;

    /** 注册资本（万元） */
    registeredCapital: number;

    /** 成立日期 */
    establishmentDate: string | null;

    /** 经营期限 */
    businessTerm: string;

    /** 官方联系电话 */
    officialPhone: string;

    /** 紧急联系人 */
    emergencyContact: string;

    /** 紧急联系电话 */
    emergencyPhone: string;

    /** 官方邮箱 */
    officialEmail: string;

    /** 主体类型 ID */
    subjectTypeId: number;

    /** 服务模式（逗号分隔） */
    serviceMode: string;

    /** 养老服务许可证号 */
    elderlyLicenseNo: string;

    /** 医疗许可证号 */
    medicalLicenseNo: string | null;

    /** 食品经营许可证号 */
    foodLicenseNo: string | null;

    /** 消防验收编号 */
    fireAcceptanceNo: string | null;

    /** 经营状态：1-正常，2-停业等 */
    businessStatus: number;

    /** 床位总数 */
    totalBeds: number;

    /** 房间配置（逗号分隔） */
    roomConfig: string;

    /** 护理等级（逗号分隔） */
    careLevel: string;

    /** 价格区间 */
    priceRange: string;

    /** 机构介绍 */
    introduction: string | null;

    /** 环境照片（逗号分隔 URL） */
    environmentPhotos: string;

    /** 创建时间 */
    createTime: string;

    /** 更新时间 */
    updateTime: string;

    /** 收藏数量 */
    collectNumber: number;
}
