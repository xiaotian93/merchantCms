// 数据请求接口地址
const api = {
	// 登录
	login : "/api/auth/login",
	// 登出
	logout:"/api/auth/logout",
	// 获取登陆信息
	get_me : "/api/auth/get_me",
	// 分期订单审核
	approve_pass:"/api/order/pass",
	approve_nopass:"/api/order/no_pass",
	// 验证短信
	verify_info:"/test",
	//上传图片
	upload:"/api/storage/upload",
	//产品列表
	product_list:'/api/common/product_list',
	//保险公司列表
	insur_company_list:'/api/common/insur_company_list',
	//收款机构列表
	receipt_list:"/api/common/receipt_list",
	//业务员列表
	clerk_list:"/api/common/clerk_list",
	//新增订单
	add:'/api/stage/add',
	//试算结果
	calc:'/api/stage/calc_plan',
	// 待审核列表
	gtask_audit:"api/stage/under_review_list",
	// 分期查询列表
	gtask_query : "api/stage/stage_order_list",
	// 获取某一条保单信息
	insur_detail : "/api/order/patch_bd/prepare",
	// 补填保单
	supplement_bd : "/api/order/patch_bd",
	// 分期订单详情页
	gtask_detail:"/api/stage/detail",
	// 分期订单图片地址
	gtask_img_url:"/api/storage/get",
	// 图片验证码-签约
	get_captcha_signed:"/api/order/sign/captcha",
	// 验证图片-签约
	verify_code_signed:"/api/order/sign/captcha/verify",
	// 获取短信-签约
	get_msg_signed:"/api/order/sign/sms",
	// 验证短信-签约
	verify_msg_signed:"/api/order/sign/sms/verify",
	// 直接签约
	order_signed:"/api/order/sign",
	// 图片验证码-绑卡
	get_captcha_bind:"/api/order/bind_card/captcha",
	// 验证图片-绑卡
	verify_code_bind:"/api/order/bind_card/captcha/verify",
	// 获取短信-绑卡
	get_msg_bind:"/api/order/bind_card/sms",
	// 验证短信-绑卡
	verify_msg_bind:"/api/order/bind_card/sms/verify",
	//推送试算方案
	push_plan:"/api/stage/push_plan",
	// 获取首付款信息
	get_payment_info:"/api/order/down_payment",
	// 获取分期详情信息
	get_payment_plan:"/api/order/repay_plan_detail",
	// 验证首付款
	verify_pay_status : "/api/order/down_payment/verify",
	// 验证还款
	verify_repay_status:"/api/order/repay/verify",
	// 分期还款
	get_repayment_info:"/api/order/repay",
	//编辑接口
	edit:'/api/stage/detail/edit',
	//提交编辑
	update:'/api/stage/update',
	// 生成合同文件
	create_contact_file:"/api/order/sign/gen_protocol",
	// 获取合同信息
	get_contact_info:"/api/storage/get_contract",
	//获取被保企业列表
	beneficiary_business_list:'/api/common/beneficiary_business_list',
	//获取还款企业列表
	borrower_business_list:'/api/common/borrower_business_list',
	//根据手机号查客户信息
	borrower_basic_info:'/api/stage/borrower_basic_info'
}

module.exports = api ;
