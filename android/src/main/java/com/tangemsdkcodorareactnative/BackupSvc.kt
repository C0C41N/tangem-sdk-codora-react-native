@file:Suppress("unused")
@file:OptIn(DelicateCoroutinesApi::class)

package com.tangemsdkcodorareactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.tangem.common.core.TangemError
import com.tangem.operations.backup.BackupService
import com.tangem.sdk.codora.TangemSdkProvider
import com.tangem.sdk.codora.addBackupCardAsync
import com.tangem.sdk.codora.proceedBackupAsync
import com.tangem.sdk.codora.readPrimaryCardAsync
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class BackupSvc(private val module: TangemModule) {

  private var backupSvc: BackupService? = null

  private fun getBackupSvc(): BackupService { return requireNotNull(backupSvc) }

  private fun backupSvcGetInfo(): WritableMap {

    fun getState(): String {
      return when (val state = getBackupSvc().currentState) {
        is BackupService.State.Preparing -> "preparing"
        is BackupService.State.FinalizingPrimaryCard -> "finalizingPrimaryCard"
        is BackupService.State.FinalizingBackupCard -> "finalizingBackupCard:${state.index}"
        is BackupService.State.Finished -> "finished"
      }
    }

    val infoMap = Arguments.createMap()

    val backupCardIds = Arguments.createArray()
    getBackupSvc().backupCardIds.forEach { backupCardIds.pushString(it) }

    infoMap.putBoolean("accessCodeIsSet", getBackupSvc().accessCodeIsSet)
    infoMap.putInt("addedBackupCardsCount", getBackupSvc().addedBackupCardsCount)
    infoMap.putArray("backupCardIds", backupCardIds)
    infoMap.putBoolean("canAddBackupCards", getBackupSvc().canAddBackupCards)
    infoMap.putBoolean("canProceed", getBackupSvc().canProceed)
    infoMap.putString("currentState", getState())
    infoMap.putBoolean("hasIncompletedBackup", getBackupSvc().hasIncompletedBackup)
    infoMap.putString("primaryCard", getBackupSvc().primaryCardId)
    infoMap.putBoolean("primaryCardIsSet", getBackupSvc().primaryCardIsSet)

    return infoMap

  }

  fun backupSvcInit(promise: Promise) {

    if(backupSvc == null)
      backupSvc = TangemSdkProvider.getBackupService()

    getBackupSvc().discardSavedBackup()
    promise.resolve(backupSvcGetInfo())

  }

  fun backupSvcReadPrimaryCard(promise: Promise) { GlobalScope.launch(Dispatchers.Main) {

    val readPrimaryCardResult = getBackupSvc().readPrimaryCardAsync(null)

    if (!readPrimaryCardResult.success) {
      module.handleReject(promise, readPrimaryCardResult.error!!)
      return@launch
    }

    promise.resolve(backupSvcGetInfo())

  } }

  fun backupSvcSetAccessCode(accessCode: String, promise: Promise) { try {

    getBackupSvc().setAccessCode(accessCode)
    promise.resolve(backupSvcGetInfo())

  } catch (err: TangemError) {

    module.handleReject(promise, err)

  } }

  fun backupSvcAddBackupCard(promise: Promise) { GlobalScope.launch(Dispatchers.Main) {

    val addBackupCardResult = getBackupSvc().addBackupCardAsync()

    if (!addBackupCardResult.success) {
      module.handleReject(promise, addBackupCardResult.error!!)
      return@launch
    }

    promise.resolve(backupSvcGetInfo())

  } }

  fun backupSvcProceedBackup(promise: Promise) { GlobalScope.launch(Dispatchers.Main) {

    val proceedBackupResult = getBackupSvc().proceedBackupAsync()

    if (!proceedBackupResult.success) {
      module.handleReject(promise, proceedBackupResult.error!!)
      return@launch
    }

    promise.resolve(backupSvcGetInfo())

  } }

}
