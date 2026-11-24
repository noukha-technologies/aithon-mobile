import React from 'react';
import { View } from 'react-native';
import { BaseToast } from 'react-native-toast-message';
import { COLORS } from './colors.config';
import { WhiteTick, WhiteCross } from '@assets/images/svg/svg_index';
import { ms, ws } from '@config/measurements.config';

export const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{
                height: 'auto',
                minHeight: ms(60),
                paddingVertical: ms(10),
                backgroundColor: COLORS.white,
                borderRadius: ms(16),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 4,
                borderLeftWidth: 0,
                marginHorizontal: ws(20),
                borderWidth: 1,
                borderColor: COLORS.border + '50',
            }}
            contentContainerStyle={{ paddingHorizontal: ws(15) }}
            text1Style={{
                fontSize: ms(15),
                fontWeight: '700',
                color: COLORS.text.primary,
            }}
            text2Style={{
                fontSize: ms(12),
                color: COLORS.text.primary,
            }}
            renderLeadingIcon={() => (
                <View style={{
                    width: ms(36),
                    height: ms(36),
                    borderRadius: ms(18),
                    backgroundColor: '#10B981',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: ws(15),
                    alignSelf: 'center'
                }}>
                    <WhiteTick width={ms(18)} height={ms(18)} />
                </View>
            )}
        />
    ),
    error: (props: any) => (
        <BaseToast
            {...props}
            style={{
                height: 'auto',
                minHeight: ms(60),
                paddingVertical: ms(10),
                backgroundColor: COLORS.white,
                borderRadius: ms(16),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 4,
                borderLeftWidth: 0,
                marginHorizontal: ws(20),
                borderWidth: 1,
                borderColor: COLORS.border + '50',
            }}
            contentContainerStyle={{ paddingHorizontal: ws(15) }}
            text1Style={{
                fontSize: ms(15),
                fontWeight: '700',
                color: COLORS.text.primary,
            }}
            text2Style={{
                fontSize: ms(12),
                color: COLORS.text.secondary,
            }}
            renderLeadingIcon={() => (
                <View style={{
                    width: ms(36),
                    height: ms(36),
                    borderRadius: ms(18),
                    backgroundColor: COLORS.text.error,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: ws(15),
                    alignSelf: 'center'
                }}>
                    <WhiteCross width={ms(16)} height={ms(16)} />
                </View>
            )}
        />
    ),
};

