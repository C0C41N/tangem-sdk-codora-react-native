package com.tangemsdkcodorareactnative

import com.facebook.react.bridge.Promise
import com.tangem.TangemSdk
import com.tangem.common.core.TangemError

interface TangemModule {
    var sdk: TangemSdk
    fun handleReject(promise: Promise, err: TangemError) {
        promise.reject("TANGEM_SDK_CODORA_ERROR", err.toString())
    }
}