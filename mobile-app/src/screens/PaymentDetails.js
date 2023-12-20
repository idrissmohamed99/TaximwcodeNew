import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
  Image,
  ImageBackground
} from 'react-native';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
var { width, height } = Dimensions.get('window');
import { PromoComp } from "../components";
import i18n from 'i18n-js';
import { useSelector, useDispatch } from 'react-redux';
import { api } from 'common';
import { MAIN_COLOR } from '../common/sharedFunctions';
import { CommonActions } from '@react-navigation/native';
import { Ionicons, Entypo, Fontisto, AntDesign, Octicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { FirebaseConfig } from '../../config/FirebaseConfig';
import PaymentWebView from '../components/PaymentWebView';
import moment from 'moment/min/moment-with-locales';

const hasNotch = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && ((height === 780 || width === 780) || (height === 812 || width === 812) || (height === 844 || width === 844) || (height === 852 || width === 852) || (height === 896 || width === 896) || (height === 926 || width === 926) || (height === 932 || width === 932))

export default function PaymentDetails(props) {
  const {
    updateBooking,
    cancelBooking,
    editPromo,
    clearMessage,
    RequestPushMsg
  } = api;
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const providers = useSelector(state => state.paymentmethods.providers);
  const { booking } = props.route.params;
  const [promodalVisible, setPromodalVisible] = useState(false);
  const { t } = i18n;
  const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;

  const [profile, setProfile] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    if (auth.profile && auth.profile.uid) {
      setProfile(auth.profile);
    } else {
      setProfile(null);
    }
  }, [auth.profile]);

  const [payDetails, setPayDetails] = useState({
    amount: booking.trip_cost,
    discount: booking.discount ? booking.discount : 0,
    usedWalletMoney: booking.payment_mode === 'wallet' ? booking.trip_cost : 0,
    promo_applied: booking.promo_applied ? booking.promo_applied : false,
    promo_details: booking.promo_details ? booking.promo_details : null,
    payableAmount: booking.payableAmount ? booking.payableAmount : booking.trip_cost
  });

  const icons = {
    'paypal': require('../../assets/payment-icons/paypal-logo.png'),
    'braintree': require('../../assets/payment-icons/braintree-logo.png'),
    'stripe': require('../../assets/payment-icons/stripe-logo.png'),
    'paytm': require('../../assets/payment-icons/paytm-logo.png'),
    'payulatam': require('../../assets/payment-icons/payulatam-logo.png'),
    'flutterwave': require('../../assets/payment-icons/flutterwave-logo.png'),
    'paystack': require('../../assets/payment-icons/paystack-logo.png'),
    'securepay': require('../../assets/payment-icons/securepay-logo.png'),
    'payfast': require('../../assets/payment-icons/payfast-logo.png'),
    'liqpay': require('../../assets/payment-icons/liqpay-logo.png'),
    'culqi': require('../../assets/payment-icons/culqi-logo.png'),
    'mercadopago': require('../../assets/payment-icons/mercadopago-logo.png'),
    'squareup': require('../../assets/payment-icons/squareup-logo.png'),
    'wipay': require('../../assets/payment-icons/wipay-logo.png'),
    'razorpay': require('../../assets/payment-icons/razorpay-logo.png'),
    'test': require('../../assets/payment-icons/test-logo.png'),
    'tylinq':require('../../assets/payment-icons/tylinc.png')


  }

  const promoModal = () => {
    return (
      <Modal
        animationType="none"
        visible={promodalVisible}
        onRequestClose={() => {
          setPromodalVisible(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ height: 50, backgroundColor: MAIN_COLOR, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.headerTitleStyle}>{t("your_promo")}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <PromoComp
              onPressButton={(item, index) => {
                selectCoupon(item, index);
              }}
            ></PromoComp>
          </View>
          <TouchableOpacity onPress={() => { setPromodalVisible(false) }} style={styles.vew3} >
            <Text style={[styles.textStyleBold, { color: colors.WHITE }]}>
              {t("cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const openPromoModal = () => {
    setPromodalVisible(!promodalVisible);
    let data = { ...payDetails };
    data.payableAmount = data.amount;
    data.discount = 0;
    data.promo_applied = false;
    data.promo_details = null;
    data.usedWalletMoney = 0;
    setPayDetails(data);
  }

  const removePromo = () => {
    let data = { ...payDetails };
    data.promo_details.user_avail = parseInt(data.promo_details.user_avail) - 1;
    delete data.promo_details.usersUsed[auth.profile.uid];
    dispatch(editPromo(data.promo_details));
    data.payableAmount = data.amount;
    data.discount = 0;
    data.promo_applied = false;
    data.promo_details = null;
    data.usedWalletMoney = 0;
    setPayDetails(data);
  }

  const doPayment = (payment_mode) => {

    if (payment_mode == 'cash') {
      let curBooking = { ...booking };
      if (booking.status == "PAYMENT_PENDING") {
        curBooking.status = 'NEW';

      } else if (booking.status == "REACHED") {
        if (booking.prepaid || curBooking.booking_from_web || curBooking.payment_mode == 'cash') {
          curBooking.status = 'PAID';
        } else {
          curBooking.status = 'PENDING';
        }
      } else if (booking.status == "PENDING") {
        curBooking.status = 'PAID';
      } else if (booking.status == "NEW") {
        curBooking.status = 'ACCEPTED';
      }
      curBooking.payment_mode = payment_mode;
      curBooking.customer_paid = curBooking.status == 'NEW' ? 0 : ((parseFloat(payDetails.amount) - parseFloat(payDetails.discount)).toFixed(settings.decimal));
      curBooking.discount = parseFloat(payDetails.discount).toFixed(settings.decimal);
      curBooking.usedWalletMoney = 0;
      curBooking.cardPaymentAmount = 0;
      curBooking.cashPaymentAmount = curBooking.status == 'NEW' ? 0 : parseFloat(payDetails.amount - parseFloat(payDetails.discount)).toFixed(settings.decimal);
      curBooking.payableAmount = parseFloat(payDetails.payableAmount).toFixed(settings.decimal);
      curBooking.promo_applied = payDetails.promo_applied;
      curBooking.promo_details = payDetails.promo_details;

      if (curBooking.status === 'ACCEPTED') {
        curBooking.driver = curBooking.selectedBid.driver;
        curBooking.driver_image = curBooking.selectedBid.driver_image;
        curBooking.driver_name = curBooking.selectedBid.driver_name;
        curBooking.driver_contact = curBooking.selectedBid.driver_contact;
        curBooking.driver_token = curBooking.selectedBid.driver_token;
        curBooking.vehicle_number = curBooking.selectedBid.vehicle_number;
        curBooking.vehicleModel = curBooking.selectedBid.vehicleModel;
        curBooking.vehicleMake = curBooking.selectedBid.vehicleMake;
        curBooking.driverRating = curBooking.selectedBid.driverRating;
        curBooking.trip_cost = curBooking.selectedBid.trip_cost;
        curBooking.convenience_fees = curBooking.selectedBid.convenience_fees;
        curBooking.driver_share = curBooking.selectedBid.driver_share;
        curBooking.driverOffers = {};
        curBooking.requestedDrivers = {};
        curBooking.driverEstimates = {};
        curBooking.selectedBid = {};
      }
      setIsLoading(true);
      dispatch(updateBooking(curBooking));
      setTimeout(() => {
        if (profile.usertype == 'customer') {
          if (curBooking.status == 'NEW' || curBooking.status == 'ACCEPTED') {
            props.navigation.navigate('BookedCab', { bookingId: booking.id });
          } else {
            props.navigation.navigate('DriverRating', { bookingId: booking });
          }
        } else {
          props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'TabRoot' }] }));
        }
        setIsLoading(false);
      }, 2000);


    } else if (payment_mode == 'wallet') {
      let curBooking = { ...booking };
      if (booking.status == "PAYMENT_PENDING") {
        curBooking.prepaid = true;
        curBooking.status = 'NEW';
      } else if (booking.status == "REACHED") {
        if (booking.prepaid || curBooking.booking_from_web) {
          curBooking.status = 'PAID';
        } else {
          curBooking.status = 'PENDING';
        }
      } else if (booking.status == "PENDING") {
        curBooking.status = 'PAID';
      } else if (booking.status == "NEW") {
        curBooking.prepaid = true;
        curBooking.status = 'ACCEPTED';
      }
      curBooking.payment_mode = payment_mode;
      curBooking.customer_paid = (parseFloat(payDetails.amount) - parseFloat(payDetails.discount)).toFixed(settings.decimal);
      curBooking.discount = parseFloat(payDetails.discount).toFixed(settings.decimal);
      curBooking.usedWalletMoney = (parseFloat(payDetails.amount) - parseFloat(payDetails.discount)).toFixed(settings.decimal);
      curBooking.cardPaymentAmount = 0;
      curBooking.cashPaymentAmount = 0;
      curBooking.payableAmount = parseFloat(payDetails.payableAmount).toFixed(settings.decimal);
      curBooking.promo_applied = payDetails.promo_applied;
      curBooking.promo_details = payDetails.promo_details;

      if (curBooking.status === 'ACCEPTED') {
        curBooking.driver = curBooking.selectedBid.driver;
        curBooking.driver_image = curBooking.selectedBid.driver_image;
        curBooking.driver_name = curBooking.selectedBid.driver_name;
        curBooking.driver_contact = curBooking.selectedBid.driver_contact;
        curBooking.driver_token = curBooking.selectedBid.driver_token;
        curBooking.vehicle_number = curBooking.selectedBid.vehicle_number;
        curBooking.vehicleModel = curBooking.selectedBid.vehicleModel;
        curBooking.vehicleMake = curBooking.selectedBid.vehicleMake;
        curBooking.driverRating = curBooking.selectedBid.driverRating;
        curBooking.trip_cost = curBooking.selectedBid.trip_cost;
        curBooking.convenience_fees = curBooking.selectedBid.convenience_fees;
        curBooking.driver_share = curBooking.selectedBid.driver_share;
        curBooking.driverOffers = {};
        curBooking.requestedDrivers = {};
        curBooking.driverEstimates = {};
        curBooking.selectedBid = {};
      }
      setIsLoading(true);
      dispatch(updateBooking(curBooking));
      setTimeout(() => {
        if (profile.usertype == 'customer') {
          if (curBooking.status == 'NEW' || curBooking.status == 'ACCEPTED') {
            props.navigation.navigate('BookedCab', { bookingId: booking.id });
          } else {
            props.navigation.navigate('DriverRating', { bookingId: booking });
          }
        } else {
          props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'TabRoot' }] }));
        }
        setIsLoading(false);
      }, 2000);
    } else {
      let curBooking = { ...booking };
      if (profile.usertype == 'customer') {

        let payData = {
          first_name: profile.firstName,
          last_name: profile.lastName,
          email: profile.email,
          email: profile.email,
          amount: payDetails.payableAmount,
          order_id: booking.id,
          name: t('bookingPayment'),
          description: t('order_id') + booking.id,
          currency: settings.code,
          quantity: 1
        }

        const paymentPacket = {
          payment_mode: payment_mode,
          customer_paid: (parseFloat(payDetails.amount) - parseFloat(payDetails.discount)).toFixed(settings.decimal),
          discount: parseFloat(payDetails.discount).toFixed(settings.decimal),
          usedWalletMoney: parseFloat(payDetails.usedWalletMoney).toFixed(settings.decimal),
          cardPaymentAmount: parseFloat(payDetails.payableAmount).toFixed(settings.decimal),
          cashPaymentAmount: 0,
          payableAmount: parseFloat(payDetails.payableAmount).toFixed(settings.decimal),
          promo_applied: payDetails.promo_applied,
          promo_details: payDetails.promo_details
        };

        curBooking.paymentPacket = paymentPacket;

        setIsLoading(true);
        dispatch(updateBooking(curBooking));

        setTimeout(() => {
          props.navigation.navigate("paymentMethod", {
            payData: payData,
            profile: profile,
            settings: settings,
            providers: providers,
            booking: curBooking
          });
          setIsLoading(false);
        }, 3000);
      } else {
        if (booking.status == "REACHED") {
          if ((booking.prepaid || curBooking.booking_from_web) && settings.prepaid) {
            curBooking.status = 'PAID';
          } else {
            curBooking.status = 'PENDING';
          }
          dispatch(updateBooking(curBooking));
        }
        props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'TabRoot' }] }));
      }

    }
  }

  const selectCoupon = (item, index) => {
    var toDay = new Date();
    var expDate = new Date(item.promo_validity)
    expDate.setDate(expDate.getDate() + 1);
    item.usersUsed = item.usersUsed ? item.usersUsed : {};
    if (payDetails.amount < item.min_order) {
      Alert.alert(t('alert'), t('promo_eligiblity'))
    } else if (item.user_avail && item.user_avail >= item.promo_usage_limit) {
      Alert.alert(t('alert'), t('promo_exp_limit'))
    } else if (item.usersUsed[auth.profile.uid]) {
      Alert.alert(t('alert'), t('promo_used'))
    } else if (toDay > expDate) {
      Alert.alert(t('alert'), t('promo_exp'))
    } else {
      let discounttype = item.promo_discount_type.toUpperCase();
      if (discounttype == 'PERCENTAGE') {
        let discount = parseFloat(payDetails.amount * item.promo_discount_value / 100).toFixed(settings.decimal);
        if (discount > item.max_promo_discount_value) {
          let discount = item.max_promo_discount_value;
          let data = { ...payDetails };
          data.discount = discount
          data.promo_applied = true
          item.user_avail = item.user_avail ? parseInt(item.user_avail) + 1 : 1;
          item.usersUsed[auth.profile.uid] = true;
          dispatch(editPromo(item));
          data.promo_details = item
          data.payableAmount = parseFloat(data.payableAmount - discount).toFixed(settings.decimal);
          setPayDetails(data);
          setPromodalVisible(false);
        } else {
          let data = { ...payDetails };
          data.discount = discount
          data.promo_applied = true
          item.user_avail = item.user_avail ? parseInt(item.user_avail) + 1 : 1;
          item.usersUsed[auth.profile.uid] = true;
          dispatch(editPromo(item));
          data.promo_details = item,
            data.payableAmount = parseFloat(data.payableAmount - discount).toFixed(settings.decimal);
          setPayDetails(data);
          setPromodalVisible(false);
        }
      } else {
        let discount = item.max_promo_discount_value;
        let data = { ...payDetails };
        data.discount = discount
        data.promo_applied = true
        item.user_avail = item.user_avail ? parseInt(item.user_avail) + 1 : 1;
        item.usersUsed[auth.profile.uid] = true;
        dispatch(editPromo(item));
        data.promo_details = item,
          data.payableAmount = parseFloat(data.payableAmount - discount).toFixed(settings.decimal);
        setPayDetails(data);
        setPromodalVisible(false);
      }
    }

  }

  const cancelCurBooking = () => {
    Alert.alert(
      t('alert'),
      t('cancel_confirm'),
      [
        { text: t('cancel'), onPress: () => { }, style: 'cancel' },
        {
          text: t('ok'), onPress: () => {
            payDetails.promo_applied ? removePromo() : null;
            dispatch(
              cancelBooking(
                {
                  booking: booking,
                  reason: t('cancelled_incomplete_booking'),
                  cancelledBy: profile.usertype
                }
              )
            );
            props.navigation.navigate('TabRoot', { screen: 'Map' });
          }
        },
      ]
    );
  };


  const [mapdalVisible, setmapdalVisible] = useState(false);
  const paymentmethods = useSelector(state => state.paymentmethods);
  const serverUrl = `https://us-central1-${FirebaseConfig.projectId}.cloudfunctions.net`;

  const payData = {
    first_name: auth.profile.firstName,
    last_name: auth.profile.lastName,
    email: auth.profile.email,
    email: auth.profile.email,
    amount: payDetails.payableAmount,
    order_id: booking.id,
    name: t('bookingPayment'),
    description: t('order_id') + booking.id,
    currency: settings.code,
    quantity: 1
  }

  const [state, setState] = useState({
    selectedProvider: null
  });

  const onSuccessHandler = (order_details) => {
    if (booking) {
      if (booking.status == "PAYMENT_PENDING") {
        props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'BookedCab', params: { bookingId: booking.id } }] }));
      } else {
        if (booking.customer_token) {
          RequestPushMsg(
            booking.customer_token,
            {
              title: t('notification_title'),
              msg: t('success_payment'),
              screen: 'BookedCab',
              params: { bookingId: booking.id }
            }
          );
        }
        if (booking.driver_token) {
          RequestPushMsg(
            booking.driver_token,
            {
              title: t('notification_title'),
              msg: t('success_payment'),
              screen: 'BookedCab',
              params: { bookingId: booking.id }
            }
          );
        }
        if (booking.status == 'NEW') {
          props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'BookedCab', params: { bookingId: booking.id } }] }));
        } else {
          props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'DriverRating', params: { bookingId: booking } }] }));
        }

      }
    } else {
      props.navigation.navigate('TabRoot', { screen: 'Wallet' });
    }
  };

  useEffect(()=>{
    if(paymentmethods.message){
      Alert.alert(t('alert'),paymentmethods.message);
      dispatch(clearMessage());
    }
  }, [paymentmethods.message]);

  const onCanceledHandler = () => {
    if (profile.usertype == 'customer') {
        props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'PaymentDetails', params: { booking:booking } }] }));
    } else {
      props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'TabRoot' }] }));
    }
  };

  const selectProvider = (provider) => {
    setState({ selectedProvider: provider });

    let curBooking = { ...booking };
    if(profile.usertype == 'customer') {
      const paymentPacket = { 
        payment_mode: "card",
        customer_paid: (parseFloat(payDetails.amount) - parseFloat(payDetails.discount)).toFixed(settings.decimal),
        discount: parseFloat(payDetails.discount).toFixed(settings.decimal),
        usedWalletMoney: parseFloat(payDetails.usedWalletMoney).toFixed(settings.decimal),
        cardPaymentAmount: parseFloat(payDetails.payableAmount).toFixed(settings.decimal),
        cashPaymentAmount: 0,
        payableAmount: parseFloat(payDetails.payableAmount).toFixed(settings.decimal),
        promo_applied: payDetails.promo_applied,
        promo_details: payDetails.promo_details 
      };
      curBooking.paymentPacket = paymentPacket;
      
      setIsLoading(true);
      dispatch(updateBooking(curBooking));
      setmapdalVisible(!mapdalVisible);

    }else{
     if(booking.status == "REACHED"){
        if((booking.prepaid || curBooking.booking_from_web) && settings.prepaid ){
          curBooking.status = 'PAID';
        } else{
          curBooking.status = 'PENDING';
        }
        dispatch(updateBooking(curBooking));
      } 
      props.navigation.dispatch(CommonActions.reset({index: 0,routes: [{ name: 'TabRoot'}]}));
    }
  };

  const payModal = () => {
    return (
      <Modal
        animationType="none"
        visible={mapdalVisible}
        onRequestClose={() => {
          setmapdalVisible(false);
        }}
      >
        {state.selectedProvider && serverUrl && payData ? <PaymentWebView serverUrl={serverUrl} provider={state.selectedProvider} payData={payData} onSuccess={onSuccessHandler} onCancel={onCanceledHandler} /> : null}
      </Modal>
    );
  };

  return (
    <View style={styles.mainView}>
      {profile && profile.usertype == "customer" && (booking.status == "PAYMENT_PENDING" || booking.status == "PENDING" || booking.status == "NEW") ?
        <View style={[styles.promo, styles.shadow, {flexDirection: isRTL ? "row-reverse" : "row", height: 75, margin: 5}]}>
          <View style={{flexDirection: isRTL ? "row-reverse" : "row", alignItems:'center' }}>
            <Fontisto name="product-hunt" size={40} color={MAIN_COLOR} />
            <View>
              <Text style={[styles.textStyleBold, {textAlign: isRTL ? "right" : "left"}]}> {t("promo")} </Text>
              <Text style={[styles.textStyle, {textAlign: isRTL ? "right" : "left"}]}> {t("apply_promo")} </Text>
            </View>
          </View>
          {payDetails.promo_applied ? 
            <TouchableOpacity onPress={() => { removePromo()}}>
              <Text style={[styles.textStyle, {textAlign: isRTL ? "right" : "left", color: colors.RED}]}> {t("remove_promo")} </Text>
            </TouchableOpacity>
          :
            <AntDesign name="pluscircleo" size={30} color={colors.BLACK}  onPress={() => { openPromoModal() }}/>
          }
        </View>
      : null}

      <View style={[styles.fare, styles.shadow,{ margin: 5}]}>
        {profile ? (
          <View style={[styles.fareRow,{ flexDirection: isRTL ? "row-reverse" : "row"}]}>
            <Text style={[styles.textStyle,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
              {profile.usertype == "customer" ? t("your_fare") : t("total_fare")}
            </Text>
            <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
              {settings.swipe_symbol ?
                (parseFloat(payDetails.amount).toFixed(settings.decimal)) + " " + (settings.symbol)
                :
                (settings.symbol) + " " + (parseFloat(payDetails.amount).toFixed(settings.decimal))
              }
            </Text>
          </View>
        ) : null}

        {profile ? (
          <View style={[styles.fareRow,{ flexDirection: isRTL ? "row-reverse" : "row"}]}>
            <Text style={[styles.textStyle,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
              {t("promo_discount")}
            </Text>
              <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50, color: colors.RED}]} >
                {settings.swipe_symbol ?
                (isRTL ? "" : "-") + " " +(payDetails ? payDetails.discount ? parseFloat(payDetails.discount).toFixed(settings.decimal) : "0.00" : "0.00") + " " + (settings.symbol) + (isRTL ? "-" :'')
                :
                  (isRTL ? "" : "-") +(settings.symbol) + " " +(payDetails ? payDetails.discount ? parseFloat(payDetails.discount).toFixed(settings.decimal) : "0.00" : "0.00") + " " + (isRTL ? "-" :'')
                }
            </Text>
          </View>
        ) : null}
        {profile ? (
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between" }}>
            <Text style={[styles.textStyle,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
              {t("payable_ammount")}
            </Text>
            <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
              {settings.swipe_symbol ?
                (payDetails.payableAmount ? parseFloat(payDetails.payableAmount).toFixed(settings.decimal) : 0.0) + " " +(settings.symbol)
              :
                (settings.symbol) + " " + (payDetails.payableAmount ? parseFloat(payDetails.payableAmount).toFixed(settings.decimal) : 0.0)
              }
            </Text>
          </View>
        ) : null}
      </View>
      
      {providers && providers.length > 0 && booking.payment_mode == "card" && profile && profile.usertype == "customer" ?
      <View style={{ marginTop: 5, margin: 5}}>
        <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", fontSize: 18 }]}>{t('select_payment_getway')}</Text>
      </View>
      : null }

      {providers && providers.length > 0 && booking.payment_mode == "card" && profile && profile.usertype == "customer" ?
        <View style={{flex: 1, margin: 5}}>
          <View style={{ height: 40, width: '100%', position: 'absolute', top: 0}}>
            <ImageBackground source={require('../../assets/images/white-grad.png')} style={{ width: width, zIndex:30, height: 30 }}/>
          </View>
          <View  style={{marginVertical: 10}}>
          {providers && state.selectedProvider == null ?
            <ScrollView showsVerticalScrollIndicator={false}>
              {
              providers.map((provider) => {
                return (
                  <TouchableWithoutFeedback onPress={()=>{selectProvider(provider)}} key={provider.name}>
                    <View style={[styles.promo, styles.shadow, styles.box,{margin: 5}]}>
                      <Image
                        style={styles.thumb}
                        source={icons[provider.name]}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                );
              })
            }
            </ScrollView>
            : null
          }
          </View>

          <View style={{ height: 30, width: '100%', position: 'absolute', bottom: 0 }}>
            <ImageBackground source={require('../../assets/images/white-grad.png')} style={{ width: width, height: 30, transform: [{ rotate: '180deg'}] }}/>
          </View>
        </View>
      : null }

      <View style={[ styles.buttonContainer, { flexDirection: isRTL ? "row-reverse" : "row", margin: 5}]}>
        {profile && profile.usertype == "customer" && (booking.status == "PAYMENT_PENDING" || booking.status == "NEW") ? 
          <TouchableOpacity onPress={cancelCurBooking}  style={[styles.buttonWrapper2,{minWidth: providers && providers.length > 0 && booking.payment_mode == "card" ? '95%' : '28%'}]} >
            <Text style={[styles.textStyleBold,{color:colors.WHITE}]}>{t("cancel")}</Text>
          </TouchableOpacity>
        : null}

        {booking.payment_mode == "wallet" ? 
          <TouchableOpacity style={styles.buttonWrapper} onPress={() => {doPayment("wallet")}}>
              <View style={styles.cardPayBtnInnner}>
              {isLoading && <ActivityIndicator size="small" color={colors.WHITE} />}
              <Text style={styles.buttonTitle}>{t("complete_payment")}</Text>
            </View>
          </TouchableOpacity>
        : null }

        {booking.payment_mode == "cash" ? 
          <TouchableOpacity style={styles.buttonWrapper} onPress={() => {doPayment("cash")}}>
            <View style={styles.cardPayBtnInnner}>
              {isLoading && <ActivityIndicator size="small" color={colors.WHITE}/>}
              <Text style={styles.buttonTitle}> {booking.status == "PAYMENT_PENDING" ? t("cash_on_delivery") : booking.payment_mode == "cash"? t("pay_cash") : t("complete_payment")} </Text>
            </View>
          </TouchableOpacity>
        : null}

        {providers && providers.length > 0 && booking.payment_mode == "card" && profile && profile.usertype == "driver" ?
          <TouchableOpacity style={[styles.buttonWrapper]} onPress={() => {doPayment("card")}}>
            <View style={styles.cardPayBtnInnner}>
              {isLoading && <ActivityIndicator size="small" color={colors.WHITE} />}
              <Text style={styles.buttonTitle}> {t("complete_payment")} </Text>
            </View>
          </TouchableOpacity>
        : null}
      </View> 
      {promoModal()}
      {payModal()}
    </View>
  );

}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    flex: 1,
    //minWidth: 150,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: 5,
    marginTop: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MAIN_COLOR,
    borderRadius: 8
  },
  buttonWrapper2: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.RED,
    borderRadius: 8
  },
  cardPayBtnInnner: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row'
  },
  buttonTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontFamily: 'Roboto-Bold'
  },
  emailStyle: {
    fontSize: 17,
    color: colors.BLACK,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center'
  },
  vew3: {
    flexDirection: 'row',
    height: 50,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.LIGHT_RED,
    borderRadius: 10,
    marginVertical: 3,
    marginBottom: 15
  },
  promo: {
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    paddingHorizontal: 15
  },
  fare: {
    marginTop: 5,
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    paddingHorizontal: 20
  },
  shadow:{
    shadowColor: colors.BUTTON_RIGHT,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 10,
  },
  box: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    height: 35,
    width: 100,
    resizeMode: 'contain'
  },
  textStyle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  textStyleBold: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold'
  },
  fareRow:{
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.FOOTERTOP
  }
});