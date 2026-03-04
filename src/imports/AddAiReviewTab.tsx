import clsx from "clsx";
import svgPaths from "./svg-jd7cyukbek";
type Container1Props = {
  additionalClassNames?: string;
};

function Container1({ children, additionalClassNames = "" }: React.PropsWithChildren<Container1Props>) {
  return (
    <div className={clsx("flex-[1_0_0] min-h-px min-w-px relative", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">{children}</div>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={clsx("flex-[1_0_0] min-h-px min-w-px relative", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">{children}</div>
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("size-[24px]", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}
type ContainerProps = {
  additionalClassNames?: string;
};

function Container({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerProps>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type TypographyText1Props = {
  text: string;
  additionalClassNames?: string;
};

function TypographyText1({ text, additionalClassNames = "" }: TypographyText1Props) {
  return (
    <div className={clsx("absolute h-[21px]", additionalClassNames)}>
      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#333] text-[14px] top-[0.5px] tracking-[0.1313px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type ContainerTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ContainerText({ text, additionalClassNames = "" }: ContainerTextProps) {
  return (
    <div className={clsx("absolute bg-[#f44336] content-stretch flex items-center justify-center rounded-[10px] size-[20px]", additionalClassNames)}>
      <p className="font-['Suisse_Int'l:Semi_Bold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">{text}</p>
    </div>
  );
}
type TypographyTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TypographyText({ text, additionalClassNames = "" }: TypographyTextProps) {
  return (
    <div className={clsx("absolute h-[19.5px]", additionalClassNames)}>
      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[#666] text-[13px] top-0 tracking-[0.1219px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TabTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TabText({ text, additionalClassNames = "" }: TabTextProps) {
  return (
    <div className={clsx("absolute content-stretch flex flex-col h-[48px] items-center justify-center overflow-clip px-[16px] py-[12px] top-0 w-[90px]", additionalClassNames)}>
      <p className="font-['Helvetica:Regular',sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[#666] text-[14px] text-center tracking-[0.4px] whitespace-nowrap">{text}</p>
    </div>
  );
}

export default function AddAiReviewTab() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Add AI Review Tab">
      <Container additionalClassNames="h-[61.5px] w-[1341px]">
        <div className="absolute h-[36px] left-[16px] top-[12.25px] w-[508.18px]" data-name="Container">
          <div className="absolute h-[21px] left-[48px] top-[7.5px] w-[460.18px]" data-name="Typography">
            <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-black top-[0.5px] tracking-[0.1313px] whitespace-nowrap">Green Trees Pte. Ltd.: Review with Accountant for 1 Jan - 31 Dec 2023</p>
          </div>
          <div className="absolute bg-[#1976d2] content-stretch flex items-center justify-center left-0 rounded-[18px] size-[36px] top-0" data-name="IconButton">
            <div className="relative shrink-0 size-[20px]" data-name="ArrowBackIcon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <g id="ArrowBackIcon">
                  <path d={svgPaths.p213ee031} fill="var(--fill-0, white)" id="Vector" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="absolute bg-[#1976d2] content-stretch flex h-[36.5px] items-center justify-center left-[1241.93px] px-[24px] py-[6px] rounded-[4px] shadow-[0px_3px_1px_0px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] top-[12px] w-[83.07px]" data-name="Button">
          <p className="font-['Helvetica:Regular',sans-serif] leading-[24.5px] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.4px] whitespace-nowrap">Done</p>
        </div>
      </Container>
      <div className="h-[49px] relative shrink-0 w-[1341px]" data-name="Container">
        <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative size-full">
          <div className="h-[48px] overflow-clip relative shrink-0 w-full" data-name="Tabs">
            <div className="absolute h-[48px] left-0 overflow-clip top-0 w-[1341px]" data-name="MuiTabsScroller">
              <div className="absolute h-[48px] left-0 top-0 w-[1341px]" data-name="MuiTabsList">
                <div className="absolute h-[48px] left-0 overflow-clip top-0 w-[90px]" data-name="Tab">
                  <p className="-translate-x-1/2 absolute font-['Helvetica:Regular',sans-serif] leading-[17.5px] left-[45.88px] not-italic text-[#1976d2] text-[14px] text-center top-[14.75px] tracking-[0.4px] whitespace-nowrap">Ticket</p>
                  <div className="absolute h-[48px] left-0 top-0 w-[90px]" data-name="MuiTouchRippleRoot" />
                </div>
                <div className="absolute h-[48px] left-[90px] overflow-clip top-0 w-[98.625px]" data-name="Tab">
                  <p className="-translate-x-1/2 absolute font-['Helvetica:Regular',sans-serif] leading-[17.5px] left-[49.5px] not-italic text-[#666] text-[14px] text-center top-[14.75px] tracking-[0.4px] whitespace-nowrap">AI Review</p>
                  <div className="absolute h-[48px] left-0 top-0 w-[98.625px]" data-name="MuiTouchRippleRoot" />
                </div>
                <div className="absolute h-[48px] left-[188.63px] overflow-clip top-0 w-[94.719px]" data-name="Tab">
                  <p className="-translate-x-1/2 absolute font-['Helvetica:Regular',sans-serif] leading-[17.5px] left-[47.5px] not-italic text-[#666] text-[14px] text-center top-[14.75px] tracking-[0.4px] whitespace-nowrap">Company</p>
                  <div className="absolute h-[48px] left-0 top-0 w-[94.719px]" data-name="MuiTouchRippleRoot" />
                </div>
                <TabText text="Chat" additionalClassNames="left-[283.34px]" />
                <TabText text="Notes" additionalClassNames="left-[373.34px]" />
              </div>
              <div className="absolute bg-[#1976d2] h-[2px] left-0 top-[46px] w-[90px]" data-name="MuiTabsIndicator" />
            </div>
          </div>
        </div>
      </div>
      <Container1 additionalClassNames="w-[1341px]">
        <div className="bg-[#fafafa] h-[781.5px] relative shrink-0 w-[64px]" data-name="Container">
          <div aria-hidden="true" className="absolute border-[#e0e0e0] border-r border-solid inset-0 pointer-events-none" />
          <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
            <div className="absolute content-stretch flex items-center justify-center left-[11.5px] rounded-[20px] size-[40px] top-[16px]" data-name="IconButton">
              <Wrapper additionalClassNames="relative shrink-0">
                <g id="HomeIcon">
                  <path d={svgPaths.p2528e580} fill="var(--fill-0, #666666)" id="Vector" />
                </g>
              </Wrapper>
            </div>
            <div className="absolute content-stretch flex items-center justify-center left-[11.5px] rounded-[20px] size-[40px] top-[72px]" data-name="IconButton">
              <Wrapper additionalClassNames="relative shrink-0">
                <g id="ChatBubbleIcon">
                  <path d={svgPaths.p2edb7d00} fill="var(--fill-0, #666666)" id="Vector" />
                </g>
              </Wrapper>
            </div>
            <div className="absolute content-stretch flex items-center justify-center left-[11.5px] rounded-[20px] size-[40px] top-[128px]" data-name="IconButton">
              <Wrapper additionalClassNames="relative shrink-0">
                <g id="PersonIcon">
                  <path d={svgPaths.p85ab180} fill="var(--fill-0, #666666)" id="Vector" />
                </g>
              </Wrapper>
            </div>
            <div className="absolute content-stretch flex items-center justify-center left-[11.5px] rounded-[20px] size-[40px] top-[184px]" data-name="IconButton">
              <Wrapper additionalClassNames="relative shrink-0">
                <g id="DescriptionIcon">
                  <path d={svgPaths.p2ce61500} fill="var(--fill-0, #666666)" id="Vector" />
                </g>
              </Wrapper>
            </div>
            <div className="absolute content-stretch flex items-center justify-center left-[11.5px] rounded-[20px] size-[40px] top-[240px]" data-name="IconButton">
              <Wrapper additionalClassNames="relative shrink-0">
                <g id="FolderIcon">
                  <path d={svgPaths.pb641e00} fill="var(--fill-0, #666666)" id="Vector" />
                </g>
              </Wrapper>
            </div>
            <div className="absolute content-stretch flex items-center justify-center left-[11.5px] rounded-[20px] size-[40px] top-[296px]" data-name="IconButton">
              <Wrapper additionalClassNames="relative shrink-0">
                <g id="MenuBookIcon">
                  <path d={svgPaths.p231b1e00} fill="var(--fill-0, #666666)" id="Vector" />
                  <path d={svgPaths.p204e1080} fill="var(--fill-0, #666666)" id="Vector_2" />
                </g>
              </Wrapper>
            </div>
            <div className="absolute content-stretch flex items-center justify-center left-[11.5px] rounded-[20px] size-[40px] top-[352px]" data-name="IconButton">
              <Wrapper additionalClassNames="relative shrink-0">
                <g id="BarChartIcon">
                  <path d={svgPaths.p1cc95f2} fill="var(--fill-0, #666666)" id="Vector" />
                </g>
              </Wrapper>
            </div>
            <div className="absolute content-stretch flex items-center justify-center left-[11.5px] rounded-[20px] size-[40px] top-[408px]" data-name="IconButton">
              <Wrapper additionalClassNames="relative shrink-0">
                <g id="DashboardIcon">
                  <path d={svgPaths.p26137100} fill="var(--fill-0, #666666)" id="Vector" />
                </g>
              </Wrapper>
            </div>
            <div className="absolute content-stretch flex items-center justify-center left-[11.5px] rounded-[20px] size-[40px] top-[464px]" data-name="IconButton">
              <Wrapper additionalClassNames="relative shrink-0">
                <g id="SettingsIcon">
                  <path d={svgPaths.p18ab9080} fill="var(--fill-0, #666666)" id="Vector" />
                </g>
              </Wrapper>
            </div>
          </div>
        </div>
        <Container1 additionalClassNames="h-[781.5px]">
          <div className="flex-[1_0_0] h-[781.5px] min-h-px min-w-px relative" data-name="Container">
            <div aria-hidden="true" className="absolute border-[#e0e0e0] border-r border-solid inset-0 pointer-events-none" />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative size-full">
              <Container additionalClassNames="h-[63.75px] w-[637.5px]">
                <TypographyText text="Make sure all checks are confirmed (0/13 done)" additionalClassNames="left-[16px] top-[21.63px] w-[280.203px]" />
                <div className="absolute border border-[#e0e0e0] border-solid h-[30.75px] left-[511.29px] rounded-[4px] top-[16px] w-[110.211px]" data-name="Button">
                  <p className="-translate-x-1/2 absolute font-['Helvetica:Regular',sans-serif] leading-[22.75px] left-[42px] not-italic text-[#666] text-[13px] text-center top-[2.5px] tracking-[0.3714px] whitespace-nowrap">Confirm all</p>
                  <div className="absolute content-stretch flex items-start left-[83.21px] size-[18px] top-[5.38px]" data-name="MuiButtonEndIcon">
                    <Wrapper1 additionalClassNames="h-[18px]">
                      <div className="absolute bottom-[33.33%] left-1/4 right-1/4 top-[35.79%]" data-name="Vector">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 5.5575">
                          <path d={svgPaths.p324409f0} fill="var(--fill-0, #666666)" id="Vector" />
                        </svg>
                      </div>
                    </Wrapper1>
                  </div>
                </div>
              </Container>
              <div className="flex-[1_0_0] min-h-px min-w-px relative w-[637.5px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-[15px] relative rounded-[inherit] size-full">
                  <div className="bg-[#e3f2fd] h-[55px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <TypographyText1 text="Functional currency of current year management report is similar to previous year" additionalClassNames="left-[48px] top-[16px] w-[514.852px]" />
                  </div>
                  <div className="bg-white h-[55px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <TypographyText1 text="Issued and paid up capital is accurate" additionalClassNames="left-[48px] top-[16px] w-[239.258px]" />
                  </div>
                  <div className="bg-white h-[75px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <div className="absolute h-[42px] left-[48px] top-[16px] w-[558.5px]" data-name="Typography">
                      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#333] text-[14px] top-[0.5px] tracking-[0.1313px] w-[519px]">Revenues are recorded correctly where any debit entries (if any) are accurate and supported by relevant credit notes</p>
                    </div>
                  </div>
                  <div className="bg-white h-[75px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <div className="absolute h-[42px] left-[48px] top-[16px] w-[558.5px]" data-name="Typography">
                      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#333] text-[14px] top-[0.5px] tracking-[0.1313px] w-[541px]">Cost of sales are recorded correctly where any credit entries (if any) are accurate and supported by relevant credit notes</p>
                    </div>
                  </div>
                  <div className="bg-white h-[55px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <TypographyText1 text="Ensure accounts do not show a gross loss in profit and loss statement" additionalClassNames="left-[48px] top-[16px] w-[442.516px]" />
                  </div>
                  <div className="bg-white h-[75px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <div className="absolute h-[42px] left-[48px] top-[16px] w-[558.5px]" data-name="Typography">
                      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#333] text-[14px] top-[0.5px] tracking-[0.1313px] w-[546px]">Other income does not consist of any debit entries; and only income from activities not related to the main business</p>
                    </div>
                  </div>
                  <div className="bg-white h-[55px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <TypographyText1 text="All expenses year on year are consistent and accurate" additionalClassNames="left-[48px] top-[16px] w-[343.938px]" />
                  </div>
                  <div className="bg-white h-[55px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <TypographyText1 text="Closing bank balance reconciles to bank statement at end of financial year" additionalClassNames="left-[48px] top-[16px] w-[470.445px]" />
                  </div>
                  <div className="bg-white h-[75px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <div className="absolute h-[42px] left-[48px] top-[16px] w-[558.5px]" data-name="Typography">
                      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#333] text-[14px] top-[0.5px] tracking-[0.1313px] w-[513px]">All investments are recorded accurately with correct share quantities verified with agreements</p>
                    </div>
                  </div>
                  <div className="bg-white h-[55px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <TypographyText1 text="Depreciation or amortisation is done for the year" additionalClassNames="left-[48px] top-[16px] w-[305.258px]" />
                  </div>
                  <div className="bg-white h-[55px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <TypographyText1 text="Inventory or stock is verified against client stock movement or inventory list" additionalClassNames="left-[48px] top-[16px] w-[473.211px]" />
                  </div>
                  <div className="bg-white h-[75px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <div className="absolute h-[42px] left-[48px] top-[16px] w-[558.5px]" data-name="Typography">
                      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#333] text-[14px] top-[0.5px] tracking-[0.1313px] w-[495px]">Prepayments, accruals and any interest on loans are recognised correctly with schedules</p>
                    </div>
                  </div>
                  <div className="bg-white h-[75px] relative shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                    <ContainerText text="!" additionalClassNames="left-[16px] top-[18px]" />
                    <div className="absolute h-[42px] left-[48px] top-[16px] w-[558.5px]" data-name="Typography">
                      <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#333] text-[14px] top-[0.5px] tracking-[0.1313px] w-[520px]">Amounts due to or due from director are recorded in their correct currency and are indeed reimbursable</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#fafafa] h-[781.5px] relative shrink-0 w-[638.5px]" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
              <div className="bg-white h-[55px] relative shrink-0 w-[638.5px]" data-name="Container">
                <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[16px] px-[16px] relative size-full">
                  <div className="h-[22px] relative shrink-0 w-full" data-name="Container">
                    <ContainerText text="!" additionalClassNames="left-0 top-[2px]" />
                    <TypographyText1 text="Functional currency of current year management report is similar to previous year" additionalClassNames="left-[32px] top-0 w-[514.852px]" />
                  </div>
                </div>
              </div>
              <Wrapper1 additionalClassNames="w-[638.5px]">
                <div className="absolute h-[78.5px] left-[24px] top-[24px] w-[590.5px]" data-name="Container">
                  <div className="absolute h-[19.5px] left-0 top-0 w-[590.5px]" data-name="Typography">
                    <p className="absolute font-['Helvetica:Bold',sans-serif] leading-[19.5px] left-0 not-italic text-[13px] text-black top-0 tracking-[0.1219px] whitespace-nowrap">Action</p>
                  </div>
                  <TypographyText text="To ensure consistent currency presentation and usage" additionalClassNames="left-0 top-[27.5px] w-[590.5px]" />
                  <div className="absolute h-[19.5px] left-0 top-[59px] w-[590.5px]" data-name="Link">
                    <div className="absolute left-0 size-[16px] top-[1.75px]" data-name="LaunchIcon">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g id="LaunchIcon">
                          <path d={svgPaths.pfff9100} fill="var(--fill-0, #1976D2)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                    <p className="absolute font-['Suisse_Int'l:Regular',sans-serif] leading-[19.5px] left-[20px] not-italic text-[#1976d2] text-[13px] top-0 whitespace-nowrap">How to work with this check</p>
                  </div>
                </div>
                <div className="absolute h-[73.125px] left-[24px] top-[126.5px] w-[590.5px]" data-name="Container">
                  <div className="absolute h-[37.125px] left-0 top-0 w-[590.5px]" data-name="FormControl">
                    <div className="absolute bg-white h-[37.125px] left-0 rounded-[4px] top-0 w-[590.5px]" data-name="Select">
                      <div className="absolute h-[37.125px] left-0 overflow-clip rounded-[4px] top-0 w-[590.5px]" data-name="MuiSelectSelect">
                        <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[20.125px] left-[14px] not-italic text-[14px] text-[rgba(0,0,0,0.87)] top-[8.5px] tracking-[0.1313px] whitespace-nowrap">Not checked</p>
                      </div>
                      <Wrapper additionalClassNames="absolute left-[559.5px] top-[6.56px]">
                        <g id="MuiSvgIconRoot">
                          <path d="M7 10L12 15L17 10H7Z" fill="var(--fill-0, black)" fillOpacity="0.54" id="Vector" />
                        </g>
                      </Wrapper>
                      <div className="absolute border border-[rgba(0,0,0,0.23)] border-solid h-[42.125px] left-0 rounded-[4px] top-[-5px] w-[590.5px]" data-name="MuiNotchedOutlined" />
                    </div>
                  </div>
                  <div className="absolute left-0 rounded-[14px] size-[28px] top-[45.13px]" data-name="IconButton">
                    <div className="absolute left-[5px] size-[18px] top-[5px]" data-name="SettingsIcon">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                        <g id="SettingsIcon">
                          <path d={svgPaths.p190b7600} fill="var(--fill-0, #666666)" id="Vector" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute content-stretch flex flex-col gap-[8px] h-[160.5px] items-start left-[24px] top-[215.63px] w-[590.5px]" data-name="Container">
                  <div className="h-[19.5px] relative shrink-0 w-full" data-name="Typography">
                    <p className="absolute font-['Helvetica:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[#333] text-[13px] top-0 tracking-[0.1219px] whitespace-nowrap">Note</p>
                  </div>
                  <div className="bg-white h-[133px] relative shrink-0 w-full" data-name="TextField">
                    <div className="absolute h-[133px] left-0 rounded-[4px] top-0 w-[590.5px]" data-name="MuiOutlinedInputRoot">
                      <div className="absolute h-[100px] left-[14px] top-[16.5px] w-[562.5px]" data-name="Text Area" />
                      <div className="absolute border border-[rgba(0,0,0,0.23)] border-solid h-[138px] left-0 rounded-[4px] top-[-5px] w-[590.5px]" data-name="MuiNotchedOutlined" />
                    </div>
                  </div>
                </div>
              </Wrapper1>
            </div>
          </div>
        </Container1>
      </Container1>
    </div>
  );
}
