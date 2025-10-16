import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl">
              Computer Expenses Analysis
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink 
                to="/" 
                className={({isActive}) => 
                  isActive 
                    ? "px-3 py-2 rounded-md text-sm font-medium bg-gray-700" 
                    : "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                }
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/framework" 
                className={({isActive}) => 
                  isActive 
                    ? "px-3 py-2 rounded-md text-sm font-medium bg-gray-700" 
                    : "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                }
              >
                Framework
              </NavLink>
              <NavLink 
                to="/templates" 
                className={({isActive}) => 
                  isActive 
                    ? "px-3 py-2 rounded-md text-sm font-medium bg-gray-700" 
                    : "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                }
              >
                Templates
              </NavLink>
              <NavLink 
                to="/expense-analysis" 
                className={({isActive}) => 
                  isActive 
                    ? "px-3 py-2 rounded-md text-sm font-medium bg-gray-700" 
                    : "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                }
              >
                Expense Analysis
              </NavLink>
              <NavLink 
                to="/transaction-analysis" 
                className={({isActive}) => 
                  isActive 
                    ? "px-3 py-2 rounded-md text-sm font-medium bg-gray-700" 
                    : "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                }
              >
                Transaction Analysis
              </NavLink>
              <NavLink 
                to="/sars-documentation" 
                className={({isActive}) => 
                  isActive 
                    ? "px-3 py-2 rounded-md text-sm font-medium bg-gray-700" 
                    : "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                }
              >
                SARS Documentation
              </NavLink>
              <NavLink 
                to="/downloads" 
                className={({isActive}) => 
                  isActive 
                    ? "px-3 py-2 rounded-md text-sm font-medium bg-gray-700" 
                    : "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                }
              >
                Downloads
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
