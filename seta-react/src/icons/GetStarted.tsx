import { createSvgIcon } from '~/utils/svg-utils'

const GetStarted = createSvgIcon(
  'GetStarted',
  { viewBox: '0 0 500 500', width: 64, height: 62 },
  <path
    fill="currentColor"
    fillRule="evenodd"
    stroke="strokeColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M 128 256.129 C 57.421 256.129 0 198.708 0 128.129 C 0 57.55 57.421 0.129 128 0.129 C 198.579 0.129 256 57.55 256 128.129 C 256 147.637 251.725 166.359 243.294 183.792 C 241.237 188.042 236.143 189.817 231.893 187.76 C 227.652 185.703 225.877 180.6 227.925 176.359 C 235.23 161.264 238.933 145.033 238.933 128.129 C 238.933 66.962 189.167 17.196 128 17.196 C 66.833 17.196 17.067 66.962 17.067 128.13 C 17.067 189.297 66.833 239.063 128 239.063 C 132.71 239.063 136.533 242.886 136.533 247.596 C 136.533 252.307 132.71 256.129 128 256.129 Z M 507.684 418.406 L 344.97 510.762 C 343.647 511.513 342.205 511.871 340.763 511.871 C 338.399 511.871 336.061 510.889 334.397 509.029 C 282.395 450.849 178.74 396.235 127.31 382.693 C 116.549 379.851 97.119 373.69 96.291 373.434 C 95.992 373.332 95.685 373.221 95.395 373.093 C 87.996 369.782 84.446 362.784 85.88 354.362 C 85.939 354.054 86.008 353.739 86.093 353.44 L 87.492 348.602 C 93.124 327.917 128.614 307.693 149.768 313.24 L 186.649 322.968 C 191.206 324.162 193.928 328.83 192.725 333.387 C 191.522 337.944 186.879 340.658 182.297 339.463 L 145.424 329.744 C 133.153 326.553 107.194 341.213 103.926 353.211 L 102.672 357.563 C 105.77 358.527 122.418 363.749 131.66 366.19 C 183.654 379.878 287.001 433.954 342.442 492.569 L 492.851 407.193 C 485.794 387.908 483.959 373.35 482.184 359.227 C 479.666 339.268 477.499 322.03 460.603 293.273 L 409.727 206.626 C 406.015 200.312 395.656 197.624 389.213 201.276 C 385.962 203.119 383.505 206.396 382.472 210.27 C 381.456 214.076 381.9 217.899 383.743 221.048 L 383.76 221.074 C 386.141 225.136 384.784 230.359 380.722 232.748 C 376.66 235.137 371.438 233.78 369.04 229.71 L 357.298 209.725 C 351.009 199.016 337.023 195.338 326.109 201.55 C 320.819 204.554 317.056 209.384 315.511 215.161 C 313.984 220.835 314.794 226.766 317.781 231.852 L 317.79 231.869 C 320.179 235.931 318.814 241.162 314.752 243.543 C 310.673 245.924 305.451 244.575 303.07 240.505 L 295.245 227.167 C 288.965 216.475 274.97 212.814 264.039 219.001 C 258.757 222.005 254.994 226.843 253.449 232.62 C 251.93 238.295 252.74 244.226 255.727 249.32 C 258.031 253.246 256.853 258.28 253.056 260.772 C 249.259 263.272 244.165 262.35 241.485 258.681 L 149.649 133.07 C 140.518 120.398 131.149 116.703 121.796 122.028 C 117.273 124.588 114.363 128.163 113.16 132.669 C 111.684 138.156 112.853 144.547 116.437 150.657 L 232.655 333.168 C 235.181 337.144 234.012 342.418 230.035 344.952 C 226.058 347.486 220.784 346.309 218.25 342.332 L 101.872 159.557 C 95.796 149.206 94.013 138.181 96.675 128.24 C 99.082 119.289 104.859 112.01 113.375 107.18 C 130.544 97.426 149.275 103.357 163.457 123.035 L 237.979 224.966 C 241.153 216.177 247.323 208.872 255.617 204.162 C 270.081 195.944 287.694 197.727 300.101 207.336 C 303.301 198.624 309.445 191.387 317.688 186.711 C 335.378 176.667 357.735 181.582 369.588 197.42 C 372.352 192.855 376.201 189.032 380.792 186.438 C 395.265 178.22 416.06 183.724 424.44 197.992 L 475.324 284.631 C 493.986 316.418 496.598 337.094 499.115 357.096 C 500.967 371.781 502.878 386.971 511.369 407.758 C 512.99 411.726 511.411 416.292 507.684 418.406 Z M 68.265 128.129 C 68.265 149.471 79.777 169.345 98.311 179.978 C 102.398 182.316 103.815 187.53 101.468 191.617 C 99.89 194.373 97.014 195.909 94.053 195.909 C 92.62 195.909 91.161 195.542 89.821 194.774 C 65.996 181.104 51.199 155.572 51.199 128.129 C 51.199 85.787 85.657 51.329 127.999 51.329 C 170.341 51.329 204.799 85.787 204.799 128.129 C 204.799 132.839 200.976 136.662 196.266 136.662 C 191.556 136.662 187.733 132.839 187.733 128.129 C 187.733 95.191 160.939 68.396 128 68.396 C 95.061 68.396 68.267 95.191 68.265 128.129 Z"
  />
)

export default GetStarted
