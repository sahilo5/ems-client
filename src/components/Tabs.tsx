import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  Children,
  isValidElement,
  cloneElement
} from "react";

// TabProps
type TabProps = {
  index: number;
  label: string;
  children: ReactNode;
  onClick?: () => void;
};


type TabsProps = {
  defaultIndex?: number;
  children: ReactNode;
};

const TabsContext = createContext<{
  activeIndex: number;
  setActiveIndex: (index: number) => void;
} | null>(null);

// Tabs
export const Tabs: React.FC<TabsProps> = ({ defaultIndex = 0, children }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const validChildren = Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[];

  const labels = validChildren.map((child) => ({
    index: child.props.index,
    label: child.props.label,
  }));

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="w-full">
        {/* Tab Buttons */}
        <div className="flex space-x-2 border-b border-gray-200 mb-1">
          {validChildren.map((child) => {
            const { index, label, onClick } = child.props;

            return (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  if (typeof onClick === "function") onClick(); // 👈 Call onClick if provided
                }}
                className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-200 ${activeIndex === index
                    ? "bg-gray-200 text-accent border-b-2 border-accent"
                    : "text-accent hover:text-accent-500 hover:bg-gray-200"
                  }`}
              >
                {label}
              </button>
            );
          })}

        </div>

        {/* Tab Content */}
        <div>
          {validChildren.map((child) =>
            child.props.index === activeIndex ? cloneElement(child) : null
          )}
        </div>
      </div>
    </TabsContext.Provider>
  );

};

// Tab Component
export const Tab: React.FC<TabProps> = ({ children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("<Tab> must be used inside <Tabs>");
  return <>{children}</>;
};
