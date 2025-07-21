import { BreakPointsSize } from "@/types/types";
import { useMediaQuery } from "@mantine/hooks";
import { useCallback } from "react";

const useBreakPoints = () => {
    const isDesktopView = useMediaQuery("(min-width: 1200px)");
    const isLaptopView = useMediaQuery(
        "(min-width: 768px) and (max-width: 1200px)"
    );
    const isTabletView = useMediaQuery(
        "(min-width: 576px) and (max-width: 768px)"
    );
    const isMobileView = useMediaQuery("(max-width: 576px)");
    // max views
    const isMaxTabletView = useMediaQuery("(max-width: 768px)");
    const isMaxLaptopView = useMediaQuery("(max-width: 1200px)");

    const getBreakpointSize = useCallback(
        (sizes: Partial<Record<BreakPointsSize, number>>): number => {
            const breakpointMap = {
                [BreakPointsSize.MOBILE]: isMobileView,
                [BreakPointsSize.TABLET]: isTabletView,
                [BreakPointsSize.LAPTOP]: isLaptopView,
                [BreakPointsSize.DESKTOP]: isDesktopView,
                [BreakPointsSize.MAX_TABLET]: isMaxTabletView,
                [BreakPointsSize.MAX_LAPTOP]: isMaxLaptopView,
            };
            const activeBreakpoint = Object.entries(breakpointMap).find(
                // eslint-disable-next-line
                ([_, val]) => val
            )?.[0] as BreakPointsSize;

            return sizes?.[activeBreakpoint] ?? (sizes?.default as number);
        },
        [
            isMobileView,
            isTabletView,
            isLaptopView,
            isDesktopView,
            isMaxTabletView,
            isMaxLaptopView,
        ]
    );

    return {
        isDesktopView,
        isLaptopView,
        isTabletView,
        isMobileView,
        isMaxTabletView,
        isMaxLaptopView,
        getBreakpointSize,
    };
};

export default useBreakPoints;
