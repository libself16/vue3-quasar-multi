<template>
  <HeaderTitleBack v-if="$q.platform.is.mobile" titleI18n="member.kyc.kyc_verify" variant="red">
    <div class="profile-container h5" v-if="step === 1" style="margin-top: 10px">
      <div class="entryMainTitle">Verify Process</div>
      <q-separator />
      <div class="info-container">
        <div class="info-container_main">
          <div class="stepBox">
            <div class="titleWrap">
              <div class="step">Step 1</div>
              <div class="stepTitle">Choose a VALID ID TYPE</div>
            </div>
            <div class="content">
              <div class="contentText">
                <div class="columnContent">
                  <p>Choose Recommend IDs for Quick Verification within 3 minutes;</p>
                  <p>Other IDs may take up to 24 hours.</p>
                </div>
              </div>
              <div class="contentImg">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABGCAYAAAAUwxD7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAfpSURBVHgB7Z1bbNtUGMf/Tpw0cdouS9qtXUfXAoWVcSl3BAx1PFDxwvUF2KQhbg88MAFCCAkQSFwfQAKJi4TEVSBeYIAAoUmwwTYhQKANbWysHStlXbuVNmmbW5PY5pyTJnGaOHE62yTd+WmWHR/7tPIv3+dzjs9cgMPhcDgcDofDsRuhXKHntrGukvs9iXD43e4wOKahd60piY/bh/XKRL0CkAqTTuFIqaJUyruDrDaAYxopUXhHVdFfsvC2sW7oSHSAU9eIRg665izX04/c4Nuc/dzoFfxXva++A45p7B5M+SNxZTj7+afDye+f2RrbXOk8QwJfu7v5xrPaxS7tPhXoA8c0ruxxFXw+e5XYRQRWPM9QCnU4BD84NQm/B9Y5+gI9nrBDUDfQ5cw25zA4trJMciB7/VGmGyHAAClF3Q69Ji7HMlxOoaIfnkLrHC6wzjHUjahEOi0jEo1DIUMJdiGKTjQ3SjjVMUVgeDbKJNpJMpWG5GlgIkuWJ9OYmp6FEVoDy+B0ZpLRVHiW1V0Jejw9L8v4RAhGWNYkwUt+b7MwRaCqGIu8w3t/wb7d32Hfrm+RiEQQj8zkypa3rUKgrQOXDtyE0y+4hG1Xws6Ir1VMEViJ0aGD+OL1F3F4zy+6x4TGj7GFHkPlXTJwI67bfD845bFcIJX35kN3FURbJabGR7HtvdfZNpdYHktboVTEe09uqUqeFipx5ycfgKOPpQK3vf8Gk3hSdRCJ8YixxsipiKUC/ypzzzMKlbefNHw4pbHsHkhbnNVEX29vDw4cGCxdF/ki0EZNNbjdItpal6NaAv4mLIbF/CwzsCwCj5HGSzVsvONW+CRvyTL6ZeCUxjKBU6RLYJSNG29BZ2cHOtes1qnr5O6jSxnLBBppePgkCVu23IuB6zLzo+69Z5NuFIaq+EKcSlgmMHRcP2qouPXrL8dLLz2Fiy86P7e/pSWAxx57AK0tQXCMYctIDKWFSFmzpgNr1/Zg/dWXQ9KJtM7O1Uzi1s++xsEDQ5j4d5LtF9QUqkFWFMTjc6g1PA1u3fHbxWCJQPdcmC0DA/0kPfYTWRITNjJylAkqRywWZ5FI0yllZGQUjz/xAnzTR4D2NTCKnFYQiSVQa9BBcDMFWpJCFYcIyetl4mjkUXkHDw4SES9i566fyp773POv4pVX38p91otUTgZTplRMTE6zlJWrVElD2Ps5u/hZATSyqESaQhdKUcjjG4crkwyygmmazUIjN3ju1Ygu6y44j/bZ3K7SSaSax0l2Us3jJCNTKixJoSqJwOCKFXAo+edqVNpFmgZLluSJGSSGT6D5sjPZZ624LDTtTrsX18Fe6ljXjWg6DckGA9NJ0yT63Pr3BFn0sHrSrkZwirFMYLS5C+EVF+YuvErS5MzPQwXHzI1OIbLvKLw9q3L7pnf9WXDMbGAtq4eK5BRjeTci4WtHYzgzxjk3WjjtQPT74N9wTu7+J0fnIGtajpnoW9wYo+hysvtNreF2uWAmlguM+9rgjfwDJxLwdrciuv8f+NadxsqcvvzNnDZkaFlDR74TH23uxmJxkPu/mXNPahXLpxXSBs1MoJdtN/Z1kVQqY/Kr3xA7NMYaMDSN0u3Qtt+JUA+Rm+knJoh4unDKY8tITIo0QmJNqyHNHmUSvT3tiA8eQ5wIpA0YBxHn71+Xi0iaOk8m+k4lbBtKo0LciTDEVISJauwrLYgOAkwHz+ONFoPYNjObptIQaU2qmg5/8UEqYlI70m7eZTCKbRFIoRLlVBIOJ0mbTvKjswMNRJxCxCpymmzaP9dz4UiSldTkxN5qUWSZLVQgVajyCbqLxjKBiZSAsVkn9h93IZYUMBl1IELWD6/0ocUVzRxExC1U9/avARxINZKIVNEVUNAVTOO8VTJWNtkTIfWG6QL/DonYccSLY9NORIkwWaHP5lSyCGz9cmI9HuzciVZ3tOjcT8fOxtajZ2TOkVX8PiogrbjZ5+6AjJv7krigI422Zi4zi2lPI6ZiwJd/+nBkSoTCpFEJZFHVeYn5JSBG0SudQKc3BMmZxHjch73TK7AnvDJ/HBFI/pG6qESVrekXoLVRwZ1XzOH6dcmyTyOqoVbvgbY9jdg/0YBthxpYqmQ5MZsXBWqg+PiJOR+OJ7qJmO68bO1x9Hz6u7MUq87vymyNzzjw7Dde7Dgk4uXbBQTNHZmqO0wR+OOIB4n5J0eF3xnWRCnannfDKNl+EbIFwnx9Ktulre2HIRcGTzgQNOEpk0/ysFawHbhEc+9aptWWu+ZFBVpb+ZWgKS6IWm2NNAJVg3n+JJC89TtmalpHnl1ooYQHbajNm9BGUg6tJbV4X0nHHHMELpcWpM6CzCnk1sK8Ea0IJmahmQUhp6LYb7MXWP3/zGavKUx7zcjhibyMrA+2rQnAsuUofSzUfPRpy3vJM+DmJT5cauucmDNawfkf4K8ZqXPKRqC4aayfridnFH+wibu2m+z1T4uJPdB5Q3LZN/YqqrCdboZi6nCQz+qzlb//JQP+89cfCQ99eFpSIA+rOseQwJSsDoNTkxhqhT760czn913r85NxYzZTt8nrCF/V49oDjmnsHkr1zcaU3Ezo7/9I0et7U6Xz9PsZ5B7o0HlrPTlph/xh2wZwTMO5aXy73lvrFVnlb61fquinUGLcTf9egQ72vtpu6SNH4jd7PJ6S/5mk3B/+4HA4HA6Hw+Fw7Oc/7HQZZ0nR4hYAAAAASUVORK5CYII="
                  alt="Step 1"
                />
              </div>
            </div>
          </div>
          <div class="stepBox">
            <div class="titleWrap">
              <div class="step">Step 2</div>
              <div class="stepTitle">Upload ID Photo</div>
            </div>
            <div class="content">
              <div class="contentText">
                <div class="columnContent">
                  <p>Take a picture of your ID or select from your album. Make sure it clearly shows your:</p>
                  <ul>
                    <li>Full name</li>
                    <li>ID Photo</li>
                    <li>Date of Birth</li>
                  </ul>
                </div>
              </div>
              <div class="contentImg">
                <img
                  src="data:image/png;base64,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"
                  alt="Step 2"
                />
              </div>
            </div>
          </div>
          <div class="stepBox">
            <div class="titleWrap">
              <div class="step">Step 3</div>
              <div class="stepTitle">Confirm Information</div>
            </div>
            <div class="content">
              <div class="contentText">
                <div class="columnContent" style="justify-content: center">
                  Double-check all scanned details from your ID.
                </div>
              </div>
              <div class="contentImg">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABGCAYAAAAUwxD7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAmHSURBVHgB7Z17cFRXHce/97GbfSUsGwJJCGGDUF4FIqJ1BDrBGYuOU0r1HxScUAszHf8QrPJHZxSCddQ6toOdKcVRi611Rv/Q1jo6DjMKFJixBTUwIChBYiCPEpLdsM/s3kfPuZvd7Ovu3n3cbVLOZ3on995z9obZz/7O43dOtgCDwWAwGAwGg1FruEKFth3D3rz3bVG//5cdfjCqht57TYn+pqVfr0zUKwB5YEzgbuYrisftp8iPLWBUjbjIHVdVdOUt3DHcAR2JPBizGtFIpYcfsBw+sM3Znbx22Tn3xtfU42BUjXPX4+5gROlPXr9zI3b6e2+Eu4u9zpDAl55seOyBFtGbfk8FOsGoGp9aZsm4Xt4qeonAoq8z1ITyPOcGY0bC+sBZjr5Am83Pc+oWeixtFvrBqClzHDyS7z8KTCM4GCCuqCehN8RlmIZF4Ir6YU3oLIcJnOUYmkYUQ5JkBEMRKCSVUCtEUUCDy4H7naoI9AdCmsRaEotLcNjqNJF5y2MSxicCMEKTZw4EIdEYjfsD2rOLQevT1yUZGfXBCHPqHbCTf3e1qIpAVTEWeTcunsflc3/D5bN/RTQYRCR4L1U2t7kVnuaF+PjW7ViyboN2XoxaRvxMpSoCizHYdw1vHX0ON3rP69bxjQxpB61D5W3Y+hge6f4aGIUxXSCVd+zpr2ZEWzHGRwZx4tWj2jmTWBhTR6FUxKsH95UkLx0q8czvfgWGPqYKPPHay5rEip5BJEaCxgYj9yOmCvxfgT7PKFTeFTLwYeTHtD6QjjhLib6VK5fh6tXr+Z9FPgh0UFMKVquI5qa5KBWPux7lUM7vqgamReAQGbyUws4vfxFOhz1vGf0wMPJjmsBxMiUwys6dX0B7+0K0L27TeVZl/eiHGdMEGhl4OB0O7Nu3F1sfSeyP2rtnl24U+kr4QNxPmCbQ955+1FBxmzc/hOef78HH1q9N3Z83z4Nnnvk6muY1gmGMmmRiKPOIlMWLF2LFimXYvOkhOHQirb29TZP4xpt/xrWrfRi9O6bd59Q4SkFWFEQik5hp2OqsuvnbcjBFoHXSrx1bt3aR5rGLyHJowgYGbmuCChEOR7RIpM0pZWBgEN/+zg/hnLgJtCyGUWRJQTAcxUyDJsGrKdCUJlThRTjsdk0cjTwq79q160TEczhz9p2Cr/3+D17ET178WepaL1IZCaqypWJ0bEJrslIPVSRwF/+gvflJATSyqETahGZLUcjyDW9JNAZJwbSZTUIjt/HBTQjN6ch4HZ2zWS35G5FSlpNqSSnLSUa2VJjShKokAhvnzwevTK+rUWnr0wYsSWJ37iHafwcNn1iqXaeLS0Kb3QlreRPsDzvmTSPqFyFWZ2A7qUSiz6rfJ8iiTXuOZHGBkYtpAkMNXvjnfzT1xqukmbz3bl9GncnBcQQv34Z9WWvq3sTZ/2TUCXhWaM+hIhm5mD6NiDpb4PIncpyTg5nbDkS3E+4tq1L9nxyahJw2ckxEX3k5RtEiaP3NTMNqsaCamC4w4myGPXgLAqKwdzQhdOUWnKsXaWWCc7ozpwMZWla3cHoSH2roQLnwpP+v5t6TmYrp2wrpgOaeZ6V27ur0kqZUxtif/onwf4e1AQxtRum578QlItRG5CbmiVEinh6MwtQkExMng5BwfRscgduaRPuyFkSuDyFCBNIBDE/EubtWpyKSNp2VRN/9RM1SaVSINeqHGA9qolyd+QXRJMBE4xo2aDFIzXZm06bUR0aTatqEP7eSirCjBZKVTRmMYjgCo2oAF2K/xoB8ARPKkHZQbFw93MJH0I6NaFc3waXq91tUohyPgRdIsymQX51MNBBxChGryBI5rf1ez+xMkpnUfGNvj6/T+9PANq9PGchbTsWO8L3a8S5ewlL5s+iUuwuKVGRZO6hAqlBlG3TLpqDAZ31r95G3t4fIM/wXun3CXzAgnEWn1A376A5cec+CcIzDWIhHkPz85gIn5llCicpEXLa6V/7hwdW4i0SkCq9HgbdRwppWGQvqaxMhsw3dZCmRd4gU96AC7l57CmPkkIkMWeG0n211Pnyj/QyarKGc+r8fXo6jfetJPTISlUmzqnKQtNcCHR4Zj3fGsG6hhOaGhMxCyexSmKlNqJFkdt4KicjjjqBCglEVvqsHELi5MyFl6vCIIax03EG73QeHEMNIxImLE/PR618wXY8IJP+RSExIVKY+AE0uBbs/OYnPrY4xgcgjkPZ5AtR/kdOKvtiArKdqAhWpHqPnfotYqDVNDv3DlEQdJU1sejmVJ09FX/qRrL9xSRwvfImsetRXvjg6mwWKuTfUQ2oF8tZZt+Ez9gO4EH4Lb0Z/BF4MwL3mIO78/RfAVI9H/1nJcUve8QuXLOCmBqqqdotLPQF4u8+C63d4IhAV43TYtFFwLbCI1Z16ZzyNRh8ZVuxGmVB5jzq+q50vsWxI3a/zXNBEypNTKxOYDn0uaSVHZMIy9Who1bkCHPbZmzPNmMgTm9tRJunyxqUhHPftzyh3eV9PmUiPpBTpltTce3kdMzIFks97afvXp8iW9/LYk/DJmfs4bY0XwE0ZUTN+Z55mNCvkVOT6bbADbR/MbvYZRXaDnPH1WTTLQg+/or+p1og8SoN7CHs/T2VxKYFUXKovRGa/mLjmtBM1T/lKsgbcwNKlOQIzBi9fcf0cC4TleDt6TDuyMSqPMikMYRVbHao6BZPZNE1Gedj2lHakU4o8hnlkCCQNVn/69R/DB1PNZ7rEcuTZebarrFTEXcNd9MDum7rTuowmVE0I9CavqbzXg3uwizSlbr5VE0ib1OWWxB+jlBJ5LeJyMIzz/7syTSWe1C6iNrp4mvcrrrOaUO50doWkxGQkliOPssrGvqHZDDIEkgxW3vxntsRy+rzVdZ8Go/pkZmLm9vqf9a07RU67sitSea9M7MGD4qM4T9JkpcjzWjt7PUJrLxi6nOuLdwbCSqqvO/3vOH2/iiZWchJzMrgnspPZNOkcjalE4iCGcAylwflvSJceFwWuHwxdhF0jJ8n8Nn0e7jXyupxpBInCfpIxOUwny9G4igBZUaCrClKZuV5OVQ8faentB8MUdPPE37q1tkflcQgVoCo4/MKiSz1gFGf7TbfNZss7XYiW+429T9/u3M9xCpVY4vIS56eR9+O2SxUvCjMKU3SlZv8wWeCVlR5SsxsG4DjulMRxT7BmszYYXmqjInkV23myYpHobNVEVHJcv5bBkdXTksQfOdLRy/6fSgwGg8GYDbwPv1UGtZ2gZKwAAAAASUVORK5CYII="
                  alt="Step 3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end-->
      <div class="btn-submit-container">
        <q-btn unelevated type="submit" @click="goStep(2)">{{ $t("common.btn.startNow") }}</q-btn>
      </div>
    </div>
    <div class="profile-container h5" v-else-if="step === 2">
      <div class="kyc_upload">
        <div class="guides" @click="goStep(1)">
          <q-img :src="svgIcon('back')" loading="lazy" class="guides_icon"></q-img>
          <span>Previous step</span>
        </div>
        <!--guild-->

        <div class="uploadImg" v-for="(imgitem, index) in formData.imgs" :key="index">
          <div class="uploadWrap" v-if="formData.imgs[index].imgs === ''">
            <PreviewImage
              :parentImage="formData.imgs[index].imgs"
              :aspectRatio="'212/120'"
              :max-file-size="2097152"
              @update:modelValue="updateListImgUrl($event, index)"
              imageToBase64
            />
          </div>
          <div class="uploadWrap" v-else>
            <div class="photoWrap">
              <img :src="formData.imgs[index].imgs" class="identityPhoto" />
              <svg
                class="id-delete css-5oc719"
                style="height: 20px; width: 20px; cursor: pointer"
                viewBox="0 0 24 24"
                @click="removePic(index)"
              >
                <circle cx="12" cy="12" r="10" fill="#F23C3B"></circle>
                <circle cx="12" cy="12" r="7.714" fill="#fff"></circle>
                <path
                  d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2.983 14.46l-1.395-1.387 3.051-3.07-3.07-3.05 1.395-1.396 3.07 3.051 3.05-3.07 1.396 1.388-3.05 3.069 3.069 3.05-1.387 1.396-3.07-3.05-3.05 3.069z"
                  fill="#F23C3B"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="btn-submit-container">
          <q-btn unelevated type="submit" @click="handleSubmit">{{ $t("common.btn.submit") }}</q-btn>
        </div>
      </div>
    </div>
    <div class="profile-container h5" v-else-if="step === 3">
      <div class="result">
        <div class="result_content">
          <q-icon name="schedule" color="primary" size="xl" class="mb-3"></q-icon>
          <p>
            {{ $t("member.kyc.result") }}
          </p>
        </div>
      </div>
    </div>
  </HeaderTitleBack>

  <!--第1步驟-->
  <div v-else-if="step === 1 && !$q.platform.is.mobile" class="profile-container pc">
    <div class="profile-header">
      <q-btn flat class="profile-header-title hide-hover" :to="{ name: 'memberProfile' }">
        <q-icon name="arrow_back" class=""></q-icon>
        {{ $t("member.kyc.kyc_status") }}
      </q-btn>
      <div>
        <q-btn rounded flat icon="mail" class="top-btn" :to="{ name: 'memberInbox' }"></q-btn>
        <q-btn rounded flat class="top-btn btn-kyc" @click="goStep(1)">
          <template v-if="userInfo2.approval_status">
            <img :src="commonResult('kyc/v2_approved.png')" />
            KYC {{ $t("member.kyc.status_success") }}
          </template>
          <template v-else>
            <img :src="commonResult('kyc/v2_rejected.png')" />
            KYC {{ $t("member.kyc.status_unverified") }}
          </template>
        </q-btn>
      </div>
    </div>

    <div class="profile-body">
      <div class="card">
        <div class="title">Step 1</div>
        <div class="contentWrap">
          <div class="left">
            <div class="name">Choose a VALID ID TYPE</div>
            <div class="detail">
              <div class="columnTip">
                <span>Choose Recommend IDs for Quick Verification within 3 minutes;</span
                ><span>Other IDs may take up to 24 hours</span>
              </div>
            </div>
          </div>
          <img
            src="data:image/png;base64,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"
            alt=""
            class="right"
          />
        </div>
      </div>
      <div class="card">
        <div class="title">Step 2</div>
        <div class="contentWrap">
          <div class="left">
            <div class="name">Upload ID Photo</div>
            <div class="detail">
              <div class="content">
                Take a picture of your ID or select from your album. Make sure it clearly shows your:
              </div>
              <div class="tip">
                <li>Full Name</li>
                <li>ID Photo</li>
                <li>Date of Birth</li>
              </div>
            </div>
          </div>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAABkCAYAAAAFQ+uyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAyISURBVHgB7Z1rbBTXFcf/M2uv7fUTY8BgBxYIjc0jISYEFIECkQJNKjU4REolpyp5IT5BValEqEnDh3yoKkV5SGkqtRIQStRKRUmUdyjFSRs1KUnqPDCkQG0cbAw49tper/c9vWd2196X7dnZ9e5d+/ykwfO4M2ubn8+999w7MwDDMAzDMAzDMAzDMAzDMAzD5AGK0YLFP7liN1LO/eeFnWBmPJn2oQAG8VqUDgPFOsWyFMyMR/hwSnyxGyhqKNipYBgJYBEZKTBcNUejKErzeweq1i6oUO+MP7byFe0QmBlPe4+/E6Gm2Bi+ABy/POpsaz3nOYgUMSXiSw9X3Lelwbor2TENzGygcVFydZ64z7ZFiIhUMVU1V9kUOxgmCQUWVMEE3EZkpIBFZKQglTZiJxhmCiptemzrRIoYHlmJxhfQDoovT4NhklBoUVL2iqtmRgpYREYKWERGClhERgpMjayYwev1IxAIQFYUVUFhYQEsKv9t5oKsiNg3MAS/X14JI1gsKuZWVUBVjXX66GcKBs0NahaIIYjozwlqGvw+87+jTF6PrkPXyybTLiJFwnyQkAgEgvB4vSgpLjJUfsjpgtfnhxmqq8phVcd//SRN/+AwzDKvuhLR2TiPx4vBYRfMUFJsRWV5KbJJ1qpms4w6h/HNxyfRc/FbDPR2o/vCuYQy1bV1WHRjA+qWN2DZLbfp20x+Ia2IF788jQ+O/A4X205PWXagtyem3PK167F++w7ctv0+MPmBdCJSBHzjpd/gs/ffgFlISlpOv/86Htz/DEfIPECqLmK/qHqf2/1AWhJGQzL+/heP6Ndl5EYqEY/8el/GpaHrkYwUaRl5kUZEag8m64hkApLxL7/9FRh5kUJEEiVT1fFEfPPPvxvq+DC5QQoR//flZ1lpx0237Ix5pOg1f3T8KNKl1GbDiGvyBC7lI3/sfAIlZeXIBMVFVn00xgxq3JQ9S4GqJ5LNosRfz2IxfT1rYSGyTc5FpE5ETwbahouX1OHs2fMw8lmUZ8wEthIagTE2CjMVNMadydEMqxg3pyVfyHnV3HMxfQk3b96ApqabDZXNxOcxmSfnfzLpRsN5NXPRvONe9PV9b6h8z4VvwchHziNivxieMwtJeODAXtTUVKOhYQUaG1dMeQ5HRDnJvYhXzYm4ZHH9mIQRmnfcM+V5nNiWk5yL6HYOpVSeesfNzfckSEhQVGxp2Tnp+aMpfh6THfKmW0UCbtp8O7Zv25ogYDTbt23Rv77+2jsinTOacJwjopxILSLJ17RuDRpuWoF1626GzVZi6DyScZ3oRb/2+jv44vOvp8wvmsXt8UELBjHTsBRYsp76yamIxSNXYPU49PXm5nt10WwlJSgtLcHixXUi8s2FWShqPv7YQ8BjwLlz53H9ej9effW4HiVLBzswUpn+g21do27TM7RlhhLhs0pEq9sxth7f0XAJYY4dOy4S1fXYvGkDjNLX168ntqMjKLUdGxogIuS7uohF7r6MiMhkjpyK6LdOPNR2VkSx9z9o1ddTEfEPf/yTLuKlrq14qOX+pGWClmIwcpFTEYOqBdtEe25TEtEaw3nBpqY1SAUaYem61I0lSxJnZbcIMSnS+gtYRNmY9ocw0V18E92dVuBzorrX/NQsT3c/NNFGK7bPT+k8Z9WNcJXfkPRYZbnN8F18/Y7hGdtGTGfcO+8ewhRIs4okEb3XUs8L+q1lYOQipyJqaoGITPUwC0VD1ZrajeAkobdoDhi5yHke0Vm1AqNlN8Aiqumqvq9jjlHEK6pLnrwOjHjguzaM4ttjq2X/gAuKkNNSGlu9OuesgKe4BgFuH0qJFDO0SQ5vSY3ovEQ9+cAxgsGPv0UwSRts5Mx3GPjgK1iFpPGijrR36cfjYQnlRqqRlVHRgaBkMxGJaBThrPMrYspR56Ro0VwUzLElXMPvcKF0VWx17y6tnRYJc5H4zQbZfu6N/pmQCFdZPUqGv4Ma9EMR/8FFi6rhbOtA1dZVUKP+w3VJk3TqKBIGvQEUzquM3V8xPclro71rZmqkuq+ZOi/R0pTdahdVcwCOU2f0NuFkONs6hYiX9WgY3T6kzhBXyfIj3yNHhDhFo9f1MWgSas6WVRhoPYPv3/5CVMnz9DYhRUs6Ru1IWkb/26u/8ari9hv1MhFIQOoIMfIjZQNnuLoRc66e1qtoEq7mR01wd16Hu+Oa3oGJho6X/GChWGpjqu/IdTga5gdSikjyUBVd7hi/K48iXSTaRappStOoE3QWRirsIl9o6m1cTA6QtstHVbSq+cd60dHE5wjjIQl5dk1+IfUDo0kod3F1Sud4CytYwjxE+iRYIKgg4PPCUlBIjzOYuKCmIRjwi6R4fkxCcLpG9UclywjlRrOdmsqLbCxNx/d7PVAtFigqLWrMMU0LCgkDuoz5As1KknnmDos4CbpsEr8igzGPVCK6fQr6R1X0u1S4xPqoV8FGEQUXpnCNa04VJ88UwWbV9KVULEurAygtyp9oORsxL+Lly1CPHIbytxNQxPpkH2BduAjepnUYemQ3/AvHtSLxep0WnL1qxcXvLegetIBeW6IvwdDX95T1eO6mK7BZfDDCs2duRpujJHy+NnY9+5wAls4NYvUiP+5Y5kMZiykVpmZoa48/fggnT+6CCYYe3Y2ulj3493fF+E+PFS4R9SLShcRR9JfoRMu4qaoDP134+ZQyHu1ajVcurYk6N3w9fVtDILyfmpJ3N3ixrdGHtfWx7bRUZming8yzu3MxQzvlE7Rly+gWgYNIg7fu2os379o3LmCMiFHbQSW0T2zPLRzB/Qu+gb24H3bb+N1/1zyl+GpoAU5cWyoi4fywxMq4iPQVoWsGYj4rtH5LnR8Hto+itiLUg2URJRNRs9urYLHsEOHDHrV7iVh2IQP869aduF5Vp48RU4S6tGAl2hdvgNNaHicnkkTJcUFjy8WJHdQS92nJpXx4oxuP3uFhESGRiCLq7UMo6mV1jKyvqh5/3bwXH665P04oimphGWOiqJJctrEoqMWcHxAbWrhMsui4oDyIY7uBZfOnvw/HIsaS8BvXli/fJULU88gBNY7L2PPmftjcQ3h73a7QTgqZ9GPFv3yR9lEojfzIWvyxuItr2tiByJr+uN+o3OOVIRWfdylCREw7uZh8apTCguwnU2I+Ua+ONe1p5JgH/vEiTq3eqVfTSaWKZkoB4zaEfApV67SVwwR4RZkNzDixY80Wyxbxrx05hiLi+vMnwlvKuEzR3mjjhycVNa6SiMhnKl3ATBuxMVjT1iIdKiqAujrR9awE2ttFrmaSe473iWbohg2hcs88k3B4niNJbjK6Gp4y+sXtC1fDei2Pyd1lsk9mGgMrVwJPPhkSK5pPPwX279eT3zE89ZToe+8KrdM5w8PACy+MHfYJYbrdbkxJvIzJ5Izsi1TD4ao5vBpTnjYreR5tTkh/GtjOncCxY4kSErTvww9DZaKhR3PFl4vivNMJ19iYcrxpUbu1xN2xKAnrVDWP1fRx0m5YBmxbzZV2LkgvItbXhyJhRcXk5agMRcdIZKT1jRvHj1P1HKbf50Ony4UfrhK5vQfD8kRfSxsXZaKaOUYwUX58U5mwPA35VdlYwlyRnoh7904tIUFlSMY9e0LbL74Y2tfYGJKStgUUBb8cHNTXS62inZiZF0QZhCXMJemJePfdxsvGV91JOihfOBwY5WlesxLzbUSqlo1EwwhUtn7iBy61iw7LkH/mPeKNMUZ271mZIJ1zfmREbxcys5e05iPqYhmNipHycZCE1EtmZgYfnfNCbentiGwHj9UaupMtvYh46JDxsidOJOyi6pglnJHYoxZDpCfi4cOJyepkUBkqG4Z6x58MDHB1zIyRnohU1ba0TC4jHYsqQ3nCT4WE/V4vGCZC+kN8JNidd4ZGT2jYjob7iE8+CeUIKRIKYWnYjqphjoJMMjI38ez48dASBwlI8nWIxZ/C68Lc3ZfbRIq5DYyUtPf47fH7RIvL8ezb7laxmvJ81mmbAWlWwAjdR4++sfbllw+CkZJwz9ie5NAOmCBeRAfShNqAvW43LovFjIARFE1L+3th8odYEVW1DSnKMyrKU8ejTyxXPZ605Iv7xlrBzBpiRFQuXGjtqq1tVVV1S7LCPiEZVbmUfhkWkc9Fz6SZntfEHt42MsLtQ4mxBrStRsoZmFWqkzDl5N3iYrtmsZzScnfLQKdaWLj1HoejE8ysYcK5T2+Vlv5cUZSfpX37gPFvpDOgKEf8BQXPNzsc3D5kGIZhGIZhGIZhGIZhGHn4P/X7YDS3lESXAAAAAElFTkSuQmCC"
            alt=""
            class="right"
          />
        </div>
      </div>
      <div class="card">
        <div class="title">Step 3</div>
        <div class="contentWrap">
          <div class="left">
            <div class="name">Confirm Information</div>
            <div class="detail"><div class="content">Double-check all scanned details from your ID.</div></div>
          </div>
          <img
            src="data:image/png;base64,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"
            alt=""
            class="right"
          />
        </div>
      </div>
      <div class="btn-submit-container">
        <q-btn unelevated color="primary" text-color="black" type="submit" @click="goStep(2)">{{
          $t("common.btn.startNow")
        }}</q-btn>
      </div>
    </div>
  </div>
  <div v-else-if="step === 2 && !$q.platform.is.mobile" class="profile-container pc">
    <div class="profile-header">
      <q-btn flat class="profile-header-title hide-hover" :to="{ name: 'memberProfile' }">
        <q-icon name="arrow_back" class=""></q-icon>
        {{ $t("member.kyc.uploadID") }}
      </q-btn>
      <div>
        <q-btn rounded flat icon="mail" class="top-btn" :to="{ name: 'memberInbox' }"></q-btn>
        <q-btn rounded flat class="top-btn btn-kyc" @click="goStep(1)">
          <template v-if="userInfo2.approval_status">
            <img :src="commonResult('kyc/v2_approved.png')" />
            KYC {{ $t("member.kyc.status_success") }}
          </template>
          <template v-else>
            <img :src="commonResult('kyc/v2_rejected.png')" />
            KYC {{ $t("member.kyc.status_unverified") }}
          </template>
        </q-btn>
      </div>
    </div>
    <div class="kyc_upload">
      <div class="guides" @click="goStep(1)">
        <q-img :src="svgIcon('back')" loading="lazy" class="guides_icon"></q-img>
        <span>Previous step</span>
      </div>
      <!--guild-->

      <div class="uploadImg" v-for="(imgitem, index) in formData.imgs" :key="index">
        <div class="uploadWrap" v-if="formData.imgs[index].imgs === ''">
          <PreviewImage
            :parentImage="formData.imgs[index].imgs"
            :aspectRatio="'212/120'"
            :max-file-size="2097152"
            @update:modelValue="updateListImgUrl($event, index)"
            imageToBase64
          />
        </div>
        <div class="uploadWrap" v-else>
          <div class="photoWrap">
            <img :src="formData.imgs[index].imgs" class="identityPhoto" />
            <svg
              class="id-delete css-5oc719"
              style="height: 20px; width: 20px; cursor: pointer"
              viewBox="0 0 24 24"
              @click="removePic(index)"
            >
              <circle cx="12" cy="12" r="10" fill="#F23C3B"></circle>
              <circle cx="12" cy="12" r="7.714" fill="#fff"></circle>
              <path
                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2.983 14.46l-1.395-1.387 3.051-3.07-3.07-3.05 1.395-1.396 3.07 3.051 3.05-3.07 1.396 1.388-3.05 3.069 3.069 3.05-1.387 1.396-3.07-3.05-3.05 3.069z"
                fill="#F23C3B"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="btn-submit-container">
        <q-btn unelevated color="primary" text-color="black" type="submit" @click="handleSubmit">{{
          $t("common.btn.submit")
        }}</q-btn>
      </div>
    </div>
  </div>
  <div v-else-if="step === 3 && !$q.platform.is.mobile" class="profile-container pc">
    <div class="profile-header">
      <q-btn flat class="profile-header-title hide-hover" :to="{ name: 'memberProfile' }">
        <q-icon name="arrow_back" class=""></q-icon>
        {{ $t("member.kyc.kyc_status") }}
      </q-btn>
      <div>
        <q-btn rounded flat icon="mail" class="top-btn" :to="{ name: 'memberInbox' }"></q-btn>
        <q-btn rounded flat class="top-btn btn-kyc" @click="goStep(1)">
          <template v-if="userInfo2.approval_status">
            <img :src="commonResult('kyc/v2_approved.png')" />
            KYC {{ $t("member.kyc.status_success") }}
          </template>
          <template v-else>
            <img :src="commonResult('kyc/v2_rejected.png')" />
            KYC {{ $t("member.kyc.status_unverified") }}
          </template>
        </q-btn>
      </div>
    </div>
    <div class="profile-body">
      <div class="result">
        <div class="result_content">
          <q-icon name="schedule" color="primary" size="xl" class="mb-3"></q-icon>
          <p>
            {{ $t("member.kyc.result") }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <!--end-->
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/okbet_red/hooks/useSiteImg"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import PreviewImage from "./components/PreviewImage.vue"

const router = useRouter()
const { t } = useI18n()
const $q = useQuasar()
const { userInfo2, setUserKyc, isKycEnabled } = useUserInfo()
const { commonResult } = useCommonImg()
const { svgIcon } = useSiteImg()

const dropdownData = reactive<{
  list: {
    label: string
    value: number
  }[]
}>({
  list: []
})
export type ImageItem = {
  id: number
  member_id: number
  imgs: string
}
const formData = reactive({
  imgs: [] as ImageItem[]
})
const id = ref(0)
const step = ref(1)

function goStep(num: number) {
  step.value = num
}
function errorMsg(msg: string) {
  $q.notify({
    type: "negative",
    message: t(msg),
    position: "top",
    timeout: 1000
  })
}

async function handleSubmit() {
  const base64Imgs = formData.imgs.filter((entry) => entry.imgs.startsWith("data:image")).map((entry) => entry.imgs)
  if (base64Imgs.length < 1) {
    errorMsg("error_message.pleaseUploadImg")
    return
  }
  const sendData = {
    imgs: base64Imgs
  }
  const { status } = await setUserKyc(sendData)
  if (status) {
    goStep(3)
  }
}

//刪除跟更換圖片都要寫入delImgId 給後端
const delImgId: number[] = []
const updateListImgUrl = (value: string, index: number) => {
  const imgData = formData.imgs[index]
  imgData.imgs = value
  //只要是更換圖
  if (value.includes("base64,")) {
    if (imgData.id !== -1) {
      delImgId.push(imgData.id)
    } /*else {
        imgData.id = 0
      }*/
  }
  //如果是最後一張圖上傳再開啟下一個
  if (formData.imgs.length < 5 && imgData.id == -1 && value.includes("base64,")) {
    imgData.id = 0
    formData.imgs.push({
      id: -1,
      member_id: 0,
      imgs: ""
    })
  }
}

const removePic = (index: number) => {
  if (
    index >= 0 &&
    index < formData.imgs.length &&
    formData.imgs[index].imgs !== "" &&
    formData.imgs[index].id !== -1
  ) {
    //formData.img[index].img = ""
    delImgId.push(formData.imgs[index].id)
    formData.imgs.splice(index, 1)
  }
}

function preventDefaults(e: Event) {
  e.preventDefault()
  e.stopPropagation()
}

onMounted(() => {
  if (formData.imgs.length < 5) {
    formData.imgs.push({
      id: -1,
      member_id: 0,
      imgs: ""
    })
  }

  if (!isKycEnabled.value) {
    console.error("KYC is not available on this site.")
    router.push({ name: "memberProfile" })
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_red/assets/css/_variable.sass";
@import "app/template/okbet_red/assets/css/button.scss";

.guides {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: #ffffffa6;
  gap: 8px;

  .guides_icon {
    width: 0.8331rem;
  }
}

.scontent {
  color: rgba($text-dark-color, 0.5);
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.stitle {
  font-size: 18px;
}
.profile-container.pc {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 70px 45px;
  .profile-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    max-height: 54px;
    @apply w-full flex justify-between items-center;
    .profile-header-title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-family: OpenSans;
      font-size: 40px;
      color: #fafafa;
      font-weight: 800;
      cursor: pointer;
      padding: 0;
      text-transform: none;
      font-weight: 800;
      .q-icon {
        font-size: 36px;
        margin-right: 12px;
      }
    }

    .top-btn {
      @include btn-common;
      background: #d45d5d !important;
      color: #ffffff !important;
      .q-icon {
        margin-right: 5px;
        font-size: 1.25rem;
      }
      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
    .btn-kyc {
      font-family: OpenSans;
      font-weight: 600;
      margin-left: 10px;
      background: none !important;
      border: 2px solid #d45d5d;
      line-height: 0;
    }
  }
  .btn-submit-container {
    @apply w-full flex justify-center items-center mb-3;
    .q-btn {
      width: 100%;
      height: 50px;
      text-transform: none;
      border-radius: 8px;
      background: $primary-color;
      color: $text-light-color;
      font-family: OpenSans;
      font-size: 16px;
      font-weight: 510;
      line-height: 19px;
      letter-spacing: 0em;
    }
  }
  .kyc_upload {
    width: 100%;
    margin-top: 10px;
    border: 2px solid $border-pale-gray-color;
    border-radius: 14px;
    padding: 20px 30px;
    font-size: 16px;
    position: relative;
    gap: 0.9375rem;
    .input_area {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .kinput {
      margin-top: 20px;
      .q-field__control {
        border-radius: 8px;
        height: 84px;
        background: $background-light-color;
        padding: 0 22px;
        border: 0px;
      }
      .q-field__native {
        color: $text-dark-color !important;
      }
      .q-field__marginal {
        height: 84px;
        .q-icon {
          font-size: 30px;
          color: rgba($text-dark-color, 0.5) !important;
        }
      }
    }

    .id_title {
      padding-top: 32px;
      color: $text-night-sky-color;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }
    .uploadImg {
      width: 100%;
      height: 218px;
      padding: 0px 28px;
      border: 1px dashed $border-sky-gray-color;
      background: $background-light-color;
      border-radius: 16px;
      margin-top: 27px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: start;
      justify-content: flex-start;
      margin-bottom: 20px;
      .uploadWrap {
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
        .photoWrap {
          position: relative;
          .identityPhoto {
            width: 203px;
            height: 122px;
            border-radius: 8px;
            position: relative;
            z-index: 1;
          }
          .id-delete {
            height: 20px;
            width: 20px;
            cursor: pointer;
            position: absolute;
            right: -10px;
            top: -10px;
            z-index: 2;
          }
        }
        .preview-image {
          width: 100%;
          height: 100%;
          position: absolute;
        }
        .uploadBtn {
          display: inline-block;
          min-width: 118px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          border-radius: 6px;
          color: $black-color;
          background: $secondary-color;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
  }

  .profile-body {
    width: 100%;
    margin-top: 1.5625rem;
    border: 2px solid $border-pale-gray-color;
    border-radius: 14px;
    padding: 20px 30px;
    font-size: 16px;
    position: relative;
    display: flex;
    gap: 0.9375rem;
    flex-wrap: wrap;
    .result {
      width: 100%;
      height: 100%;
      .result_content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 2rem 2rem;
        img {
          margin-bottom: 10px;
        }
        p {
          width: 400px;
          font-size: 16px;
          text-align: center;
          line-height: 33px;
          margin-bottom: 20px;
          color: #fff4f4 !important;
        }
      }
    }
    .card {
      margin: 40px 0px 0px;
      width: 100%;
      min-height: 171px;
      border-bottom: 1px solid $border-pale-gray-color;
      display: flex;
      flex-direction: column;
      .title {
        height: 26px;
        line-height: 26px;
        font-size: 18px;
        font-weight: 600;
        color: #fff4f4;
        margin-bottom: 19px;
        font-family: OpenSans;
        font-weight: 600;
      }
      .contentWrap {
        width: 100%;
        min-height: 100px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        .right {
          width: 162px;
        }
        .left {
          flex: 1 1 0%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: flex-start;
          .tip {
            display: flex;
            flex-wrap: wrap;
            color: #ffffffa6;
            font-size: 14px;
            gap: 12px;
            li {
              font-family: OpenSans;
              font-weight: 400;
              width: 30%;
              list-style: disc;
              &::marker {
                color: $secondary-color;
              }
            }
          }
          .name {
            font-size: 18px;
            font-family: Helvetica;
            color: #fff4f4;
            font-weight: 700;
            margin-bottom: 16px;
          }
          .detail {
            width: 100%;
            color: #ffffffa6;
            .columnTip,
            .content {
              font-family: OpenSans;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
}

.profile-container.h5 {
  width: 100%;
  display: inline-grid;
  row-gap: 1rem;
  background-color: $background-light-color;
  @include phone-width {
    row-gap: 0.5rem;
  }
  .btn-submit-container {
    @apply w-full flex justify-center items-center mb-3;
    padding: 0rem 1.5rem;
    .q-btn {
      width: 100%;
      height: 50px;
      text-transform: none;
      border-radius: 8px;
      background: $secondary-color;
      color: $black-color;
      font-family: OpenSans;
      font-size: 16px;
      font-weight: 510;
      line-height: 19px;
      letter-spacing: 0em;
    }
  }
  .result {
    width: 100%;
    height: 100%;
    background-color: $background-pale-gray-color;
    .result_content {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: $background-light-color;
      box-shadow: rgba($box-shadow-deep-slate-color, 0.06) 0px 6rem 10rem;
      padding: 2rem 2rem 2rem;
      img {
        margin-bottom: 10px;
      }
      p {
        color: #fff4f4 !important;
      }
    }
  }
  .kyc_upload {
    width: 100%;
    margin-top: 10px;

    padding: 20px 30px;
    font-size: 16px;
    position: relative;
    gap: 0.9375rem;
    .input_area {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .kinput {
      margin-top: 20px;
      .q-field__control {
        border-radius: 8px;
        height: 84px;
        background: $background-light-color;
        padding: 0 22px;
        border: 0px;
      }
      .q-field__native {
        color: $text-dark-color !important;
      }

      .q-field__marginal {
        height: 84px;
        .q-icon {
          font-size: 30px;
          color: rgba($text-dark-color, 0.5) !important;
        }
      }
    }

    .id_title {
      padding-top: 32px;
      color: $text-night-sky-color;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }
    .uploadImg {
      width: 100%;
      height: 218px;
      padding: 0px 28px;
      border: 1px dashed $border-sky-gray-color;
      background: $background-light-color;
      border-radius: 16px;
      margin-top: 27px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: start;
      justify-content: flex-start;
      margin-bottom: 20px;
      .uploadWrap {
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
        .photoWrap {
          position: relative;
          .identityPhoto {
            width: 203px;
            height: 122px;
            border-radius: 8px;
            position: relative;
            z-index: 1;
          }
          .id-delete {
            height: 20px;
            width: 20px;
            cursor: pointer;
            position: absolute;
            right: -10px;
            top: -10px;
            z-index: 2;
          }
        }
        .preview-image {
          width: 100%;
          height: 100%;
          position: absolute;
        }
        .uploadBtn {
          display: inline-block;
          min-width: 118px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          border-radius: 6px;
          color: $black-color;
          background: $secondary-color;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
  }

  .entryMainTitle {
    font-family: Helvetica;
    width: 100%;
    color: $text-deep-ocean-color;
    font-size: 15px;
    font-weight: 400;
    text-transform: capitalize;
    background: $background-light-color;
    padding: 1rem 1rem 0.2rem 1rem;
  }

  .info-container {
    padding: 1rem 1rem;
    background: $background-light-color;
    .info-container_main {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-flow: column;

      .stepBox {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-flow: column;
        margin-bottom: 0.8rem;
        .titleWrap {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          flex-flow: column;
          padding: 0 0.5rem;
          .step {
            font-family: Helvetica;
            font-weight: 400;
            color: #fff4f4;
            font-size: 15px;
          }
          .stepTitle {
            font-family: Helvetica;
            font-size: 17px;
            font-weight: 700;
            color: $text-deep-ocean-color;
            text-transform: capitalize;
          }
        }
        .content {
          width: 100%;
          border-radius: 12px;
          background: $background-light-color;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.3rem;
          line-height: 13px;
          padding-top: 5px;
          .contentText {
            flex: 1 1 0%;
            width: 100%;
            height: 100%;
            font-size: 13px;
            color: $text-smoke-gray-color;
            font-weight: 400;
            text-transform: capitalize;
            display: flex;
            align-items: center;
            ul {
              margin-top: 0.5rem;
              display: flex;
              flex-direction: column;
              li {
                color: $text-deep-ocean-color;
                margin-left: 1.2rem;
                list-style: disc;
                margin-top: 0.2rem;
                &::marker {
                  color: $secondary-color;
                }
              }
            }
            .columnContent {
              font-family: Helvetica;
              font-weight: 400;
              width: 100%;
              min-height: 95px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: flex-start;
              padding: 1rem 0.5rem;
              color: #ffffffa6;
            }
          }
          .contentImg {
            flex-shrink: 0;
            background: $background-pale-gray-color;
            border-radius: 10px;
            margin-left: 10px;
            img {
              display: block;
              margin: 0px;
            }
          }
        }
      }
    }
    .q-separator {
      margin-left: 1.75rem;
      margin-right: 1.75rem;
      height: 1px;
      background-color: $background-pale-gray-color;
      @include phone-width {
        margin-left: 14px;
        margin-right: 14px;
      }
    }
  }
}

.inbox-title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: $primary-color;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-transform: none;
  font-weight: 800;
}

.hide-hover {
  :deep(.q-focus-helper) {
    opacity: 0 !important;
    background-color: transparent !important;
  }
}

.q-focus-helper {
  height: unset !important;
}
</style>
