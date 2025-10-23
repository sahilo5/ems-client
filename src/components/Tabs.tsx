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

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="w-aut">
        {/* Tab Buttons */}
        <div className="flex space-x-2 mb-2 sticky top-0 rounded-md z-10">
          {validChildren.map((child) => {
            const { index, label, onClick } = child.props;

            return (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  if (typeof onClick === "function") onClick(); 
                }}
                className={`px-4 py-2 text-sm backdrop-blur-3xl bg-white/20 font-medium text-accent rounded-md shadow-2xl  ${activeIndex === index
                    ? "bg-white/40  border-1 shadow-md  border-white"
                    : " bg-white/10  hover:text-accent-500 hover:bg-white/50 shadow-md"
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
